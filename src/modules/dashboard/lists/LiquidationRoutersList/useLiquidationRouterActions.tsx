import { Trans } from '@lingui/macro';
import { useModalContext } from 'src/hooks/useModal';
import { useRootStore } from 'src/store/root';

import { LiquidationRouterItem } from './types';

/**
 * The button state and modal wiring of a liquidation router row, shared by the desktop
 * row and the mobile card so the two can never drift apart.
 */
export const useLiquidationRouterActions = ({
  reserve,
  underlyingAsset,
  underlyingBalance,
  router,
  armingState,
  is2FAEnabled,
}: LiquidationRouterItem) => {
  const { openSupplyForLiquidations } = useModalContext();
  const currentMarket = useRootStore((store) => store.currentMarket);

  // A router whose asset is not a reserve of this market has nothing to act on here.
  const orphaned = !reserve;
  const isActive = reserve?.isActive ?? false;
  const isPaused = reserve?.isPaused ?? false;
  const isFrozen = reserve?.isFrozen ?? false;

  // Mirrors the reserve page: committing collateral is gated behind the 2FA window.
  const requires2FAandIsNotEnabled = (reserve?.usageAsCollateralEnabled ?? false) && !is2FAEnabled;
  const unavailable = orphaned || !isActive || isFrozen || isPaused || requires2FAandIsNotEnabled;

  return {
    currentMarket,
    orphaned,
    // Deploying a router needs no supplied balance; committing aTokens to one does.
    disableAction: unavailable || (!!router && Number(underlyingBalance) === 0),
    disableRevoke: orphaned || !isActive || isPaused,
    // Only a live allowance can be revoked; "never approved" has nothing to undo.
    canRevoke: armingState === 'armed',
    // The first-touch label is phrased as the invitation it is: the user already has a
    // deposit at this point, and this is the entry point to putting it to work.
    // Subsequent states keep their mechanical names, since by then the user is inside
    // the flow and "create"/"arm" are the accurate words.
    actionLabel: !router ? (
      <Trans>Put your deposits for liquidations</Trans>
    ) : armingState === 'armed' ? (
      <Trans>Supply</Trans>
    ) : (
      <Trans>Arm router</Trans>
    ),
    openModal: (revoke?: boolean) =>
      openSupplyForLiquidations(
        underlyingAsset,
        currentMarket,
        reserve?.name ?? underlyingAsset,
        'dashboard',
        revoke,
        router?.address
      ),
  };
};
