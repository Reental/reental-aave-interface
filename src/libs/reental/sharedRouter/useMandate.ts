import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useRootStore } from 'src/store/root';
import { MarketDataType } from 'src/ui-config/marketsConfig';

import {
  ATOKEN_ABI,
  LIQUIDATION_WHITELIST_ABI,
  SHARED_LIQUIDATION_ROUTER_ABI,
  UNCONSTRAINED_THRESHOLD,
} from './abi';
import { PonderCollateralOrder } from './ponder/types';
import { usePonderMandate } from './usePonderMandate';

/**
 * The connected wallet's mandate on the shared liquidation router.
 *
 * Hybrid on purpose. The amounts are read from the chain because this backs a form that
 * sends transactions: it has to be authoritative the instant a tx confirms, and it has to
 * work with the indexer down. The indexer supplies what the chain cannot — which collateral
 * assets this LP has ever funded (an unbounded scan on-chain) and lifetime earnings — so
 * the two are merged rather than one replacing the other.
 */

export type CollateralBudget = {
  asset: string;
  /** Configured per-asset budget, 8-decimal USD. Dormant while the LP is aggregating. */
  budget: string;
  /** What is left of the per-asset budget, 8-decimal USD. */
  remaining: string;
  /**
   * What the router would actually spend on this asset, resolved the same way it resolves
   * it when filling: the pooled budget when aggregating, the per-asset one otherwise.
   */
  effective: string;
  /** Whether `effective` came from the pooled budget rather than this asset's own. */
  fromGlobalBudget: boolean;
  /** At or above 1e36 the contract treats the budget as unconstrained. */
  unconstrained: boolean;
  /** Whether this LP's recipient may receive this collateral. */
  whitelisted: boolean;
  /** Lifetime totals from the indexer; absent when it is unreachable. */
  lifetime?: Pick<PonderCollateralOrder, 'totalReceivedUsd' | 'totalReceivedUnits' | 'fillCount'>;
};

export type DebtAsset = {
  asset: string;
  aToken: string;
  /** Per-liquidation cap in the debt asset's own decimals. 0 means uncapped. */
  maxDebt: string;
  /** aToken allowance granted to the router — this is what arms the LP. */
  allowance: string;
  /** aToken balance. A ceiling in its own right, and one the indexer does not track. */
  balance: string;
};

export type Mandate = {
  recipient: string;
  registered: boolean;
  enabled: boolean;
  /** true = aggregation: one pooled budget funds every RWA, including ones listed later. */
  acceptsAllCollateral: boolean;
  /** Pooled budget remaining, 8-decimal USD. Only spent while `acceptsAllCollateral`. */
  globalBudget: string;
  globalBudgetUnconstrained: boolean;
  debtAssets: DebtAsset[];
  budgets: CollateralBudget[];
  /**
   * Armed on at least one debt asset. There is no such flag on-chain or in the indexer —
   * it is a join over allowance and balance, computed here rather than guessed at.
   */
  isArmed: boolean;
};

export const sharedRouterQueryKey = (chainId: number, user?: string) => [
  'sharedRouterMandate',
  chainId,
  user?.toLowerCase(),
];

const isUnconstrained = (value: string) => BigInt(value) >= UNCONSTRAINED_THRESHOLD;

export const useMandate = ({
  marketData,
  user,
  collateralAssets,
}: {
  marketData: MarketDataType;
  user: string;
  /** RWA reserves to report budgets for; normally the market's collateral reserves. */
  collateralAssets: string[];
}) => {
  const jsonRpcProvider = useRootStore((store) => store.jsonRpcProvider);
  const router = marketData.addresses.SHARED_LIQUIDATION_ROUTER;

  const { data: indexed, isLoading: indexerLoading } = usePonderMandate(user);

  /**
   * An LP may hold a budget on an asset the current market no longer lists, so the indexed
   * orders are unioned in rather than filtered against the reserve list — otherwise that
   * budget becomes invisible and unspendable from this UI.
   */
  const known = new Set(collateralAssets.map((asset) => asset.toLowerCase()));
  const assets = [
    ...collateralAssets,
    ...(indexed?.orders ?? [])
      .map((order) => order.collateralAsset)
      .filter((asset) => !known.has(asset.toLowerCase())),
  ];

  const query = useQuery({
    queryKey: [...sharedRouterQueryKey(marketData.chainId, user), assets.join(',')],
    // Waiting on the indexer would make the whole card hostage to it; it only widens the
    // asset list, so a failed lookup degrades to the market's own reserves.
    enabled: !!router && !!user && !indexerLoading,
    staleTime: 15_000,
    queryFn: async (): Promise<Mandate> => {
      const provider = jsonRpcProvider(marketData.chainId);
      const contract = new ethers.Contract(
        router as string,
        SHARED_LIQUIDATION_ROUTER_ABI,
        provider
      );

      const [mandate, debtAssetAddresses, whitelistAddress, globalBudget] = await Promise.all([
        contract.mandateOf(user),
        contract.getDebtAssets(),
        contract.whitelist(),
        contract.globalCollateralBudget(user),
      ]);

      const whitelist = new ethers.Contract(whitelistAddress, LIQUIDATION_WHITELIST_ABI, provider);

      const debtAssets: DebtAsset[] = await Promise.all(
        (debtAssetAddresses as string[]).map(async (asset) => {
          const aToken: string = await contract.aTokenOf(asset);
          const aTokenContract = new ethers.Contract(aToken, ATOKEN_ABI, provider);

          const [maxDebt, allowance, balance] = await Promise.all([
            contract.maxDebtPerLiquidation(user, asset),
            aTokenContract.allowance(user, router),
            aTokenContract.balanceOf(user),
          ]);

          return {
            asset,
            aToken,
            maxDebt: maxDebt.toString(),
            allowance: allowance.toString(),
            balance: balance.toString(),
          };
        })
      );

      // Budgets and the whitelist only mean anything once a recipient exists, and an
      // unregistered wallet would otherwise pay for a full fan-out to read zeroes.
      const budgets: CollateralBudget[] = mandate.registered
        ? await Promise.all(
            assets.map(async (asset) => {
              const [budget, remaining, effective, whitelisted] = await Promise.all([
                contract.collateralBudget(user, asset),
                contract.remainingBudget(user, asset),
                contract.effectiveBudget(user, asset),
                whitelist.isWhitelisted(asset, mandate.recipient).catch(() => false),
              ]);

              const effectiveUsd = effective.budgetUsd.toString();

              return {
                asset,
                budget: budget.toString(),
                remaining: remaining.toString(),
                effective: effectiveUsd,
                fromGlobalBudget: effective.isGlobal,
                unconstrained: isUnconstrained(effectiveUsd),
                whitelisted,
                lifetime: (indexed?.orders ?? []).find(
                  (order) => order.collateralAsset.toLowerCase() === asset.toLowerCase()
                ),
              };
            })
          )
        : [];

      return {
        recipient: mandate.recipient,
        registered: mandate.registered,
        enabled: mandate.enabled,
        acceptsAllCollateral: mandate.acceptsAllCollateral,
        globalBudget: globalBudget.toString(),
        globalBudgetUnconstrained: isUnconstrained(globalBudget.toString()),
        debtAssets,
        budgets,
        isArmed: debtAssets.some(
          (debtAsset) =>
            BigInt(debtAsset.allowance) > BigInt(0) && BigInt(debtAsset.balance) > BigInt(0)
        ),
      };
    },
  });

  return query;
};
