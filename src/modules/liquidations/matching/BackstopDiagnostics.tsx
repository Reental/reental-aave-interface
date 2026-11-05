import { Trans } from '@lingui/macro';
import { Warning } from 'src/components/primitives/Warning';
import { ComputedReserveData } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useCollateralTransferCheck } from 'src/libs/reental/sharedRouter/useCollateralTransferCheck';
import { useRootStore } from 'src/store/root';

/**
 * The one blocker the matching totals cannot reveal: a router that is not allowed to hold this
 * collateral. Seized collateral passes through the router before reaching any recipient, so when
 * the token's control contract bars the router, every liquidation of this collateral reverts —
 * however healthy the providers and numbers look.
 *
 * The per-provider breakdown this used to show (budgets, approvals, whitelists, per-liquidation
 * limits) is operator plumbing, not something a liquidator can act on. All a user needs is the
 * matchable figure and the positions table; this surfaces only the hard blocker they cannot see.
 */
export const BackstopDiagnostics = ({
  collateralReserve,
}: {
  collateralReserve: ComputedReserveData;
}) => {
  const currentMarketData = useRootStore((store) => store.currentMarketData);

  const { data: transferCheck } = useCollateralTransferCheck({
    marketData: currentMarketData,
    collateralAsset: collateralReserve.underlyingAsset,
    aTokenAddress: collateralReserve.aTokenAddress,
  });

  if (!transferCheck || transferCheck.routerAllowed) return null;

  return (
    <Warning severity="error" sx={{ mb: 4 }}>
      <Trans>
        The router is not permitted to hold {collateralReserve.symbol}, and seized collateral passes
        through it before reaching any recipient. Every liquidation of this collateral will revert
        until Reental whitelists the router on the token&apos;s control contract.
      </Trans>
    </Warning>
  );
};
