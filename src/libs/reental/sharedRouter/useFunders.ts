import { useQuery } from '@tanstack/react-query';

import { ponderRequest } from './ponder/client';
import { FUNDERS_QUERY } from './ponder/queries';
import { PonderCollateralOrder, PonderLp, PonderPage } from './ponder/types';

/**
 * Which LPs could fund a liquidation of one collateral asset.
 *
 * The union of two disjoint sets, because the two collateral modes live in different
 * tables. An *enumerated* LP appears in `collateralOrders` for each asset it funds; an
 * *aggregating* LP appears in none of them — its appetite is a single pooled budget on the
 * `lp` row that covers every property. Querying only the orders table would therefore drop
 * exactly the LPs most likely to fill, and do it silently.
 *
 * This is a candidate shortlist, not a decision. `quote()` is what decides — see
 * `useCandidates`.
 */

type FundersResponse = {
  collateralOrders: PonderPage<PonderCollateralOrder & { lp: PonderLp | null }>;
  lps: PonderPage<PonderLp>;
};

export type Funder = {
  address: string;
  recipient: string;
  /** 8-decimal USD available for this asset, from whichever budget applies. */
  budgetUsd: string;
  fromGlobalBudget: boolean;
};

export const useFunders = ({
  collateralAsset,
  limit = 50,
  enabled = true,
}: {
  collateralAsset?: string;
  limit?: number;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: ['sharedRouterFunders', collateralAsset?.toLowerCase(), limit],
    enabled: enabled && !!collateralAsset,
    staleTime: 15_000,
    retry: 1,
    queryFn: async (): Promise<Funder[]> => {
      const data = await ponderRequest<FundersResponse>(FUNDERS_QUERY, {
        asset: collateralAsset?.toLowerCase(),
        limit,
      });

      const enumerated: Funder[] = data.collateralOrders.items
        // A dormant order left behind by an LP that has since switched to aggregation would
        // otherwise be counted twice, once here and once from the pooled query below.
        .filter((order) => order.lp && order.lp.enabled && !order.lp.acceptsAllCollateral)
        .map((order) => ({
          address: order.lpAddress,
          recipient: order.lp?.recipient ?? '',
          budgetUsd: order.budgetRemaining,
          fromGlobalBudget: false,
        }));

      const aggregating: Funder[] = data.lps.items.map((lp) => ({
        address: lp.address,
        recipient: lp.recipient,
        budgetUsd: lp.globalBudgetRemaining,
        fromGlobalBudget: true,
      }));

      return [...enumerated, ...aggregating].sort((a, b) =>
        BigInt(b.budgetUsd) > BigInt(a.budgetUsd) ? 1 : -1
      );
    },
  });
