import { BigNumber, ethers, providers } from 'ethers';

import {
  AAVE_POOL_LIQUIDATION_ABI,
  ATOKEN_ABI,
  LIQUIDATION_BONUS_BIT_OFFSET,
  LIQUIDATION_BONUS_MASK,
  POOL_ADDRESSES_PROVIDER_ABI,
  PRICE_ORACLE_ABI,
  RESERVE_DECIMALS_BIT_OFFSET,
  RESERVE_DECIMALS_MASK,
  SHARED_LIQUIDATION_ROUTER_ABI,
  SHARED_LIQUIDATION_ROUTER_SIMULATE_ABI,
} from './abi';
import { computeDebtToCover, DebtToCoverInputs, DebtToCoverResult } from './computeDebtToCover';

/**
 * Reads everything `computeDebtToCover` needs from the liquidation pool and prices it, then
 * sizes the call. All reads are pinned to one block so accrued interest cannot shift the inputs
 * between them — the read → compute → simulate → send sequence must stay tight.
 */

const ZERO = ethers.constants.AddressZero;
const toBig = (value: BigNumber): bigint => value.toBigInt();

export interface FetchDebtToCoverParams {
  provider: providers.Provider;
  router: string;
  borrower: string;
  collateralAsset: string;
  debtAsset: string;
  /** Pool to use if the router does not expose liquidationPool() (older deployments). */
  fallbackPool?: string;
  /**
   * A cap in debt base units — backstop capacity or a user-entered amount. The result is
   * min(this, what Aave will repay).
   */
  userAmount?: bigint;
}

export interface FetchDebtToCoverResult extends DebtToCoverResult {
  inputs: DebtToCoverInputs;
  pool: string;
}

export const fetchDebtToCover = async ({
  provider,
  router,
  borrower,
  collateralAsset,
  debtAsset,
  fallbackPool,
  userAmount,
}: FetchDebtToCoverParams): Promise<FetchDebtToCoverResult> => {
  // One block for every read below.
  const blockTag = await provider.getBlockNumber();

  const routerContract = new ethers.Contract(router, SHARED_LIQUIDATION_ROUTER_ABI, provider);

  let poolAddress = fallbackPool;
  try {
    poolAddress = (await routerContract.liquidationPool({ blockTag })) as string;
  } catch {
    // Older routers may not expose liquidationPool(); fall back to the configured lending pool.
  }
  if (!poolAddress || poolAddress === ZERO) {
    throw new Error('SLR: could not resolve the liquidation pool');
  }

  const pool = new ethers.Contract(poolAddress, AAVE_POOL_LIQUIDATION_ABI, provider);

  const [
    debtReserveData,
    collateralReserveData,
    debtConfig,
    collateralConfig,
    accountData,
    poolRevisionBn,
    addressesProvider,
  ] = await Promise.all([
    pool.getReserveData(debtAsset, { blockTag }),
    pool.getReserveData(collateralAsset, { blockTag }),
    pool.getConfiguration(debtAsset, { blockTag }),
    pool.getConfiguration(collateralAsset, { blockTag }),
    pool.getUserAccountData(borrower, { blockTag }),
    pool.POOL_REVISION({ blockTag }),
    pool.ADDRESSES_PROVIDER({ blockTag }),
  ]);

  const providerRegistry = new ethers.Contract(
    addressesProvider as string,
    POOL_ADDRESSES_PROVIDER_ABI,
    provider
  );
  const oracleAddress = (await providerRegistry.getPriceOracle({ blockTag })) as string;
  const oracle = new ethers.Contract(oracleAddress, PRICE_ORACLE_ABI, provider);

  const readBalance = async (token: string): Promise<bigint> => {
    if (!token || token === ZERO) return BigInt(0);
    const erc20 = new ethers.Contract(token, ATOKEN_ABI, provider);
    return toBig(await erc20.balanceOf(borrower, { blockTag }));
  };

  const [variableDebt, stableDebt, collateralBalance, priceDebt, priceCollateral] =
    await Promise.all([
      readBalance(debtReserveData.variableDebtTokenAddress as string),
      readBalance(debtReserveData.stableDebtTokenAddress as string),
      readBalance(collateralReserveData.aTokenAddress as string),
      oracle.getAssetPrice(debtAsset, { blockTag }).then(toBig),
      oracle.getAssetPrice(collateralAsset, { blockTag }).then(toBig),
    ]);

  const debtConfigBits = toBig(debtConfig);
  const collateralConfigBits = toBig(collateralConfig);

  const inputs: DebtToCoverInputs = {
    debt: variableDebt + stableDebt,
    healthFactor: toBig(accountData.healthFactor),
    collateralBalance,
    liquidationBonus:
      (collateralConfigBits >> LIQUIDATION_BONUS_BIT_OFFSET) & LIQUIDATION_BONUS_MASK,
    collateralDecimals:
      (collateralConfigBits >> RESERVE_DECIMALS_BIT_OFFSET) & RESERVE_DECIMALS_MASK,
    debtDecimals: (debtConfigBits >> RESERVE_DECIMALS_BIT_OFFSET) & RESERVE_DECIMALS_MASK,
    priceDebt,
    priceCollateral,
    poolRevision: toBig(poolRevisionBn),
  };

  return { ...computeDebtToCover(inputs, userAmount), inputs, pool: poolAddress };
};

export interface SimulateLiquidateResult {
  ok: boolean;
  reason?: string;
  debtCovered?: bigint;
  collateralSeized?: bigint;
}

/**
 * Dry-runs liquidate() with eth_call. A non-reverting call passes; a revert returns its reason
 * (e.g. "SLR: nothing to liquidate", "SLR: no eligible LP capacity") so the caller can show it
 * instead of broadcasting a doomed transaction. When the call decodes a return value, the exact
 * repay amount comes back too.
 */
export const simulateLiquidate = async ({
  provider,
  router,
  from,
  borrower,
  collateralAsset,
  debtAsset,
  debtToCover,
  candidates,
}: {
  provider: providers.Provider;
  router: string;
  from: string;
  borrower: string;
  collateralAsset: string;
  debtAsset: string;
  debtToCover: bigint;
  candidates: string[];
}): Promise<SimulateLiquidateResult> => {
  const iface = new ethers.utils.Interface(SHARED_LIQUIDATION_ROUTER_SIMULATE_ABI);
  const data = iface.encodeFunctionData('liquidate', [
    borrower,
    collateralAsset,
    debtAsset,
    debtToCover.toString(),
    candidates,
  ]);

  try {
    const raw = await provider.call({ to: router, data, from });
    try {
      const decoded = iface.decodeFunctionResult('liquidate', raw);
      return {
        ok: true,
        debtCovered: (decoded.debtCovered as BigNumber).toBigInt(),
        collateralSeized: (decoded.collateralSeized as BigNumber).toBigInt(),
      };
    } catch {
      // The on-chain function returns nothing to decode; a non-reverting call is still a pass.
      return { ok: true };
    }
  } catch (error) {
    const reason =
      (error as { reason?: string })?.reason ??
      (error as { data?: { message?: string } })?.data?.message ??
      (error as Error)?.message ??
      'liquidation would revert';
    return { ok: false, reason };
  }
};
