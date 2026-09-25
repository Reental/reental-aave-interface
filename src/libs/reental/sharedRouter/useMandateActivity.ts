import { useQuery } from '@tanstack/react-query';

import { SkipReason } from './abi';
import { ponderRequest } from './ponder/client';
import { FILLS_QUERY, SKIPS_QUERY } from './ponder/queries';
import { PonderFill, PonderPage, PonderSkip } from './ponder/types';

/**
 * What actually happened to an LP: what it earned, and what it was passed over for.
 *
 * The second half matters more than the first. A liquidation skips an ineligible LP rather
 * than reverting, so an LP can sit misconfigured and earning nothing with every screen
 * looking healthy. `reasonName` is the only signal that ever says why.
 */

const LIMIT = 50;

/** Each skip reason maps to exactly one thing the LP can do about it. */
export const SKIP_FIXES: Record<SkipReason, string> = {
  NotRegistered: 'Register a recipient on the router.',
  Disabled: 'Your mandate is paused — switch participation back on.',
  NoCollateralBudget: 'Top up your budget for this collateral, or the pooled one if you aggregate.',
  RecipientNotWhitelisted: 'Ask Reental to whitelist your recipient for this property.',
  NoCapacity: 'Raise your aToken allowance, aToken balance, or per-liquidation debt cap.',
};

export const useMandateActivity = (user?: string) => {
  const me = user?.toLowerCase();

  const fills = useQuery({
    queryKey: ['sharedRouterFills', me],
    enabled: !!me,
    staleTime: 30_000,
    retry: 1,
    queryFn: async () => {
      const data = await ponderRequest<{ fills: PonderPage<PonderFill> }>(FILLS_QUERY, {
        me,
        limit: LIMIT,
      });
      return data.fills;
    },
  });

  const skips = useQuery({
    queryKey: ['sharedRouterSkips', me],
    enabled: !!me,
    staleTime: 30_000,
    retry: 1,
    queryFn: async () => {
      const data = await ponderRequest<{ skips: PonderPage<PonderSkip> }>(SKIPS_QUERY, {
        me,
        limit: LIMIT,
      });
      return data.skips;
    },
  });

  return { fills, skips };
};
