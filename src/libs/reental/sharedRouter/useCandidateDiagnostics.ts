import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useRootStore } from 'src/store/root';
import { MarketDataType } from 'src/ui-config/marketsConfig';

import {
  ATOKEN_ABI,
  LIQUIDATION_WHITELIST_ABI,
  SHARED_LIQUIDATION_ROUTER_ABI,
  SkipReason,
} from './abi';
import { ponderRequest } from './ponder/client';
import { PonderLp, PonderPage } from './ponder/types';

/**
 * Why each liquidity provider can or cannot fund one (collateral, debt) pair.
 *
 * `quote()` answers *how much* an LP can contribute but never *why* it is zero, and the
 * router skips an ineligible LP silently rather than reverting. Without this, a pair that
 * cannot be filled looks identical to a pair nobody has funded — and the two need opposite
 * responses: one is a configuration mistake with a named owner, the other is a shortage of
 * liquidity.
 *
 * The reasons deliberately reuse the indexer's `LpSkipped` taxonomy, so what this predicts
 * before a liquidation and what the chain reports afterwards use the same words.
 */

export type CandidateDiagnostic = {
  lp: string;
  recipient: string;
  /** What the router would actually let this LP cover, in debt-asset base units. */
  maxDebt: string;
  /** Undefined when the LP can fund; otherwise the first gate that stops it. */
  blockedBy?: SkipReason;
  /** The specific ceiling behind a NoCapacity verdict, which the reason alone hides. */
  detail?: 'allowance' | 'balance' | 'cap';
  budgetUsd: string;
  allowance: string;
  balance: string;
  maxDebtPerLiquidation: string;
  whitelisted: boolean;
};

/** Bounded so a market with many LPs cannot turn one panel into hundreds of RPC calls. */
const MAX_DIAGNOSED = 25;

const LPS_QUERY = /* GraphQL */ `
  query DiagnosticLps($limit: Int!) {
    lps(limit: $limit) {
      items {
        address
        recipient
        enabled
        acceptsAllCollateral
        globalBudgetRemaining
      }
    }
  }
`;

export const useCandidateDiagnostics = ({
  marketData,
  collateralAsset,
  debtAsset,
  enabled = true,
}: {
  marketData: MarketDataType;
  collateralAsset?: string;
  debtAsset?: string;
  enabled?: boolean;
}) => {
  const jsonRpcProvider = useRootStore((store) => store.jsonRpcProvider);
  const router = marketData.addresses.SHARED_LIQUIDATION_ROUTER;

  return useQuery({
    queryKey: ['sharedRouterDiagnostics', marketData.chainId, collateralAsset, debtAsset],
    enabled: enabled && !!router && !!collateralAsset && !!debtAsset,
    staleTime: 15_000,
    queryFn: async (): Promise<CandidateDiagnostic[]> => {
      const provider = jsonRpcProvider(marketData.chainId);
      const contract = new ethers.Contract(
        router as string,
        SHARED_LIQUIDATION_ROUTER_ABI,
        provider
      );

      // The indexer knows every registered LP without an RPC round trip each; the router's
      // own list is the fallback when it is unreachable.
      let addresses: string[];
      try {
        const data = await ponderRequest<{ lps: PonderPage<PonderLp> }>(LPS_QUERY, {
          limit: MAX_DIAGNOSED,
        });
        addresses = data.lps.items.map((lp) => lp.address);
      } catch {
        addresses = ((await contract.getLps()) as string[]).slice(0, MAX_DIAGNOSED);
      }

      if (!addresses.length) return [];

      const [whitelistAddress, aToken] = await Promise.all([
        contract.whitelist(),
        contract.aTokenOf(debtAsset),
      ]);
      const whitelistContract = new ethers.Contract(
        whitelistAddress,
        LIQUIDATION_WHITELIST_ABI,
        provider
      );
      const aTokenContract = new ethers.Contract(aToken, ATOKEN_ABI, provider);

      // One quote for the whole set: it is the authority on the final number, and asking
      // per-LP would multiply calls for an answer the batch already gives.
      const quote = await contract.quote(addresses, collateralAsset, debtAsset);

      return Promise.all(
        addresses.map(async (lp, index) => {
          const [mandate, budget, cap, allowance, balance] = await Promise.all([
            contract.mandateOf(lp),
            contract.effectiveBudget(lp, collateralAsset),
            contract.maxDebtPerLiquidation(lp, debtAsset),
            aTokenContract.allowance(lp, router),
            aTokenContract.balanceOf(lp),
          ]);

          const whitelisted: boolean = mandate.registered
            ? await whitelistContract
                .isWhitelisted(collateralAsset, mandate.recipient)
                .catch(() => false)
            : false;

          const budgetUsd = budget.budgetUsd.toString();
          const maxDebt = quote.maxDebt[index].toString();

          // Ordered the way the router applies them, so the reason shown is the first gate
          // that actually stops this LP rather than an arbitrary one of several.
          let blockedBy: SkipReason | undefined;
          let detail: CandidateDiagnostic['detail'];

          if (!mandate.registered) blockedBy = 'NotRegistered';
          else if (!mandate.enabled) blockedBy = 'Disabled';
          else if (BigInt(budgetUsd) === BigInt(0)) blockedBy = 'NoCollateralBudget';
          else if (!whitelisted) blockedBy = 'RecipientNotWhitelisted';
          else if (BigInt(maxDebt) === BigInt(0)) {
            blockedBy = 'NoCapacity';
            if (BigInt(allowance.toString()) === BigInt(0)) detail = 'allowance';
            else if (BigInt(balance.toString()) === BigInt(0)) detail = 'balance';
            else detail = 'cap';
          }

          return {
            lp,
            recipient: mandate.recipient,
            maxDebt,
            blockedBy,
            detail,
            budgetUsd,
            allowance: allowance.toString(),
            balance: balance.toString(),
            maxDebtPerLiquidation: cap.toString(),
            whitelisted,
          };
        })
      );
    },
  });
};
