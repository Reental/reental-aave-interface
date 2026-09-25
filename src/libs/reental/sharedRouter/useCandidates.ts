import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useRootStore } from 'src/store/root';
import { MarketDataType } from 'src/ui-config/marketsConfig';

import { SHARED_LIQUIDATION_ROUTER_ABI } from './abi';
import { ponderRequest } from './ponder/client';
import { FUNDERS_QUERY } from './ponder/queries';
import { PonderCollateralOrder, PonderLp, PonderPage } from './ponder/types';

/**
 * Which LPs can actually fund a given liquidation, and for how much.
 *
 * Two stages, because neither source is sufficient alone. The indexer shortlists — it knows
 * both collateral modes and can filter thousands of LPs down to a candidate list without an
 * RPC round trip per LP. Then `quote()` decides: it mirrors the on-chain filter exactly,
 * including the two ceilings the indexer cannot see (aToken balance, and the allowance as
 * of this block). Recomputing eligibility in TypeScript would mean maintaining a fourth
 * copy of that logic, so we don't.
 *
 * Disagreement between the two is an indexer bug worth reporting, not something to route
 * around here: one eth_call is far cheaper than a reverted liquidation.
 */

export type Candidate = {
  lp: string;
  /** Debt this LP could cover, in debt-asset base units. */
  maxDebt: string;
  /** Collateral they would receive, in collateral-asset base units. */
  collateralOut: string;
};

type FundersResponse = {
  collateralOrders: PonderPage<PonderCollateralOrder & { lp: PonderLp | null }>;
  lps: PonderPage<PonderLp>;
};

export const useCandidates = ({
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
    queryKey: ['sharedRouterCandidates', marketData.chainId, collateralAsset, debtAsset],
    enabled: enabled && !!router && !!collateralAsset && !!debtAsset,
    staleTime: 15_000,
    queryFn: async () => {
      const provider = jsonRpcProvider(marketData.chainId);
      const contract = new ethers.Contract(
        router as string,
        SHARED_LIQUIDATION_ROUTER_ABI,
        provider
      );

      const maxCandidates = Number(await contract.MAX_CANDIDATES());

      // Shortlist from the indexer, covering both collateral modes. If it is unreachable we
      // fall back to the router's own LP set — correct, just unfiltered, so it can overflow
      // MAX_CANDIDATES on a busy router. Better a truncated list than no liquidation at all.
      let shortlist: string[];
      let shortlistSource: 'indexer' | 'chain' = 'indexer';
      try {
        const data = await ponderRequest<FundersResponse>(FUNDERS_QUERY, {
          asset: collateralAsset?.toLowerCase(),
          limit: 100,
        });

        const enumerated = data.collateralOrders.items
          .filter((order) => order.lp && order.lp.enabled && !order.lp.acceptsAllCollateral)
          .map((order) => order.lpAddress);
        const aggregating = data.lps.items.map((lp) => lp.address);

        shortlist = Array.from(new Set([...enumerated, ...aggregating]));
      } catch {
        shortlist = (await contract.getLps()) as string[];
        shortlistSource = 'chain';
      }

      // quote() itself is bounded by MAX_CANDIDATES, so the slice has to happen first.
      const truncated = shortlist.length > maxCandidates;
      const quoted = shortlist.slice(0, maxCandidates);

      const empty = {
        candidates: [] as Candidate[],
        collateralPerDebt: '0',
        totalLps: shortlist.length,
        shortlistSource,
        truncated,
        quoteError: undefined as string | undefined,
      };

      if (!quoted.length) return empty;

      /**
       * quote() reverts rather than returning zeroes when the pair itself cannot be
       * liquidated — "SLR: bad liquidation bonus" on a reserve configured with none, for
       * instance. That is a fact about the market worth showing, not a failed request, so
       * it is returned as a reason instead of thrown into an empty candidate list.
       */
      let quote;
      try {
        quote = await contract.quote(quoted, collateralAsset, debtAsset);
      } catch (error) {
        const reason =
          (error as { reason?: string })?.reason ?? 'the router could not price this pair';
        return { ...empty, quoteError: reason };
      }

      const candidates: Candidate[] = quoted
        .map((lp, index) => ({
          lp,
          maxDebt: quote.maxDebt[index].toString(),
          collateralOut: quote.collateralOut[index].toString(),
        }))
        // An LP quoting zero contributes nothing; including it just wastes a candidate slot.
        .filter((candidate) => BigInt(candidate.maxDebt) > BigInt(0))
        .sort((a, b) => (BigInt(b.maxDebt) > BigInt(a.maxDebt) ? 1 : -1));

      return {
        ...empty,
        candidates,
        collateralPerDebt: quote.collateralPerDebt.toString(),
      };
    },
  });
};
