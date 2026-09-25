import { useQuery } from '@tanstack/react-query';

import { ponderRequest, PonderUnavailableError } from './ponder/client';
import { MANDATE_QUERY, META_QUERY } from './ponder/queries';
import {
  PonderCollateralOrder,
  PonderDebtAssetListing,
  PonderDebtCap,
  PonderLp,
  PonderPage,
  PonderRouterConfig,
  PonderTokenApproval,
} from './ponder/types';

/**
 * The indexed view of a wallet's mandate.
 *
 * This is the discovery layer, not the source of truth for the forms: it answers "which
 * collateral assets has this LP ever funded" and "how much have they earned" — questions
 * the contract cannot answer without an unbounded scan — while the amounts a transaction
 * depends on are read from the chain in `useMandate`.
 */

type MandateResponse = {
  lp:
    | (PonderLp & {
        orders: PonderPage<PonderCollateralOrder>;
        debtCaps: PonderPage<PonderDebtCap>;
      })
    | null;
  debtAssetListings: PonderPage<PonderDebtAssetListing>;
  routerConfigs: PonderPage<PonderRouterConfig>;
  tokenApprovals: PonderPage<PonderTokenApproval>;
};

export type PonderMandate = {
  lp: PonderLp | null;
  orders: PonderCollateralOrder[];
  debtCaps: PonderDebtCap[];
  listings: PonderDebtAssetListing[];
  config?: PonderRouterConfig;
  approvals: PonderTokenApproval[];
};

export const usePonderMandate = (user?: string) =>
  useQuery({
    queryKey: ['sharedRouterPonderMandate', user?.toLowerCase()],
    enabled: !!user,
    staleTime: 15_000,
    // An unreachable indexer is a state to render, not a failure to retry into the ground.
    retry: 1,
    queryFn: async (): Promise<PonderMandate> => {
      const data = await ponderRequest<MandateResponse>(MANDATE_QUERY, {
        me: user?.toLowerCase(),
      });

      return {
        lp: data.lp,
        orders: data.lp?.orders.items ?? [],
        debtCaps: data.lp?.debtCaps.items ?? [],
        listings: data.debtAssetListings.items,
        config: data.routerConfigs.items[0],
        approvals: data.tokenApprovals.items,
      };
    },
  });

/**
 * Indexer reachability and how far it has synced.
 *
 * Kept separate from the data queries so "indexer offline" can be shown as its own state
 * rather than being mistaken for "no data yet" — on a fresh router both look identical.
 */
export const useIndexerStatus = () =>
  useQuery({
    queryKey: ['sharedRouterIndexerStatus'],
    staleTime: 10_000,
    refetchInterval: 30_000,
    retry: 1,
    queryFn: async () => {
      try {
        const data = await ponderRequest<{
          _meta: { status: Record<string, { id: number; block: { number: number } }> };
        }>(META_QUERY);

        const chain = Object.values(data._meta.status ?? {})[0];
        return {
          online: true,
          block: chain?.block?.number,
          reason: undefined as string | undefined,
        };
      } catch (error) {
        if (error instanceof PonderUnavailableError) {
          return { online: false, block: undefined, reason: error.reason };
        }
        throw error;
      }
    },
  });
