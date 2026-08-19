import { useQuery } from '@tanstack/react-query';
import { MarketDataType } from 'src/ui-config/marketsConfig';

import { ponderQuery } from './ponder/client';
import { ROUTERS_BY_BACKSTOP, SYNC_STATUS } from './ponder/queries';
import { PonderRouter, PonderSyncStatus } from './ponder/types';

/**
 * The liquidation routers a user backstops, read from the Ponder indexer.
 *
 * This replaces a backwards `eth_getLogs` walk over the factory's deployment events. The
 * indexer additionally knows each router's arming state — whether its backstop has granted
 * the aToken allowance that `liquidate()` pulls from on its first line — which cannot be
 * derived from deployment events at all.
 *
 * `backstop` is the wallet that funds the debt and grants that allowance, so it is the
 * field that answers "which routers are mine".
 */

export type UserLiquidationRouter = PonderRouter;

/** Routers grouped by the addresses a reserve can be matched on, lowercased. */
export type UserLiquidationRouters = {
  all: UserLiquidationRouter[];
  /** Keyed by both aToken and underlying; a reserve may map to several routers. */
  byAsset: Record<string, UserLiquidationRouter[]>;
};

const EMPTY: UserLiquidationRouters = { all: [], byAsset: {} };

const index = (routers: UserLiquidationRouter[]): UserLiquidationRouters => {
  const byAsset: Record<string, UserLiquidationRouter[]> = {};

  for (const router of routers) {
    for (const key of [router.aToken.toLowerCase(), router.token.toLowerCase()]) {
      byAsset[key] = byAsset[key] ?? [];
      // A router matches on both its aToken and its underlying; only list it once.
      if (!byAsset[key].includes(router)) byAsset[key].push(router);
    }
  }

  return { all: routers, byAsset };
};

/**
 * The router a per-reserve view should act on when the user backstops several for the
 * same asset: prefer an armed one, then the most recently deployed.
 */
export const primaryRouter = (routers: UserLiquidationRouter[] = []) =>
  routers.find((router) => router.isArmed) ??
  routers.slice().sort((a, b) => Number(b.createdAtBlock) - Number(a.createdAtBlock))[0] ??
  null;

const useRoutersQuery = <T = UserLiquidationRouters,>(
  marketData: MarketDataType,
  user: string,
  select?: (routers: UserLiquidationRouters) => T
) => {
  const factory = marketData.addresses.LIQUIDATION_ROUTER_FACTORY;

  return useQuery({
    queryKey: ['liquidationRouters', marketData.chainId, factory, user?.toLowerCase()],
    enabled: !!factory && !!user,
    staleTime: 30_000,
    select,
    // An unreachable indexer must surface as an error state, never as an empty list.
    retry: 1,
    queryFn: async (): Promise<UserLiquidationRouters> => {
      if (!factory || !user) return EMPTY;

      const data = await ponderQuery<{ routers: { items: PonderRouter[] } }>(
        ROUTERS_BY_BACKSTOP,
        // The indexer normalises the input, so a checksummed address from wagmi matches.
        { backstop: user.toLowerCase() }
      );

      return index(data.routers.items);
    },
  });
};

/** Every liquidation router the user backstops on this market. */
export const useUserLiquidationRouters = ({
  marketData,
  user,
}: {
  marketData: MarketDataType;
  user: string;
}) => useRoutersQuery(marketData, user);

/** The user's primary router for a single reserve, or null when they have none. */
export const useUserLiquidationRouter = ({
  marketData,
  user,
  aTokenAddress,
  underlyingAsset,
}: {
  marketData: MarketDataType;
  user: string;
  aTokenAddress: string;
  underlyingAsset: string;
}) =>
  useRoutersQuery(marketData, user, ({ byAsset }) =>
    primaryRouter(byAsset[aTokenAddress.toLowerCase()] ?? byAsset[underlyingAsset.toLowerCase()])
  );

/** Indexer head, for a "data as of block N" indicator and stall detection. */
export const usePonderSyncStatus = () =>
  useQuery({
    queryKey: ['liquidationRoutersSync'],
    staleTime: 30_000,
    retry: 1,
    queryFn: async () => {
      const data = await ponderQuery<{ _meta: { status: PonderSyncStatus } }>(SYNC_STATUS);
      return data._meta.status;
    },
  });
