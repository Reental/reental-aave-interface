import { t } from '@lingui/macro';
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

/**
 * Each skip reason maps to exactly one thing the LP can do about it.
 *
 * Functions rather than constants so the text is translated at render time, in the active
 * locale, instead of once at import.
 */
export const skipFix = (reason: SkipReason): string =>
  ({
    NotRegistered: t`Register a recipient on the router.`,
    Disabled: t`Your mandate is paused — switch participation back on.`,
    NoCollateralBudget: t`Top up your budget for this collateral, or the pooled one if you aggregate.`,
    RecipientNotWhitelisted: t`Ask Reental to whitelist your recipient for this property.`,
    NoCapacity: t`Raise your aToken allowance, aToken balance, or per-liquidation debt cap.`,
  }[reason]);

/** Short name for a skip reason, shown in place of the raw enum key. */
export const skipLabel = (reason: SkipReason): string =>
  ({
    NotRegistered: t`Not registered`,
    Disabled: t`Paused`,
    NoCollateralBudget: t`No budget for this collateral`,
    RecipientNotWhitelisted: t`Recipient not whitelisted`,
    NoCapacity: t`No capacity`,
  }[reason] ?? reason);

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
