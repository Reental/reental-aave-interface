import { Trans } from '@lingui/macro';
import { Box, Tooltip, Typography } from '@mui/material';
import { CompactableTypography, CompactMode } from 'src/components/CompactableTypography';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Link } from 'src/components/primitives/Link';
import { ArmingState } from 'src/libs/reental/liquidationRouter/ponder/format';
import { UserLiquidationRouter } from 'src/libs/reental/liquidationRouter/useUserLiquidationRouter';
import { useRootStore } from 'src/store/root';

import { LiquidationRouterPosition } from './useLiquidationRouterPositions';

/**
 * Pieces shared by the desktop row and the mobile card of the liquidation routers list.
 */

/**
 * How much the router may pull from the backstop.
 *
 * An unlimited approval never re-emits as it is spent, so the indexed figure cannot be
 * presented as a precise number — it is labelled rather than formatted.
 */
export const CommittedAmount = ({
  position,
  align = 'flex-start',
}: {
  position: LiquidationRouterPosition;
  align?: 'flex-start' | 'flex-end';
}) => {
  const { router, committed, committedUnlimited, committedUsd, armingState } = position;

  if (!router) {
    return (
      <Typography variant="secondary14" color="text.disabled">
        <Trans>No router</Trans>
      </Typography>
    );
  }

  if (committedUnlimited) {
    return (
      <Tooltip
        title={
          <Trans>
            An unlimited approval is not re-emitted as it is spent, so no exact remaining figure can
            be shown.
          </Trans>
        }
        arrow
        placement="top"
      >
        <Typography variant="secondary14" color="primary.main">
          <Trans>Unlimited</Trans>
        </Typography>
      </Tooltip>
    );
  }

  if (armingState === 'never-approved') {
    return (
      <Typography variant="secondary14" color="text.disabled">
        <Trans>Never approved</Trans>
      </Typography>
    );
  }

  // Decimals were unknown, so a formatted number would be a guess.
  if (committed === null) {
    return (
      <Typography variant="secondary14" color="text.disabled">
        <Trans>Unknown</Trans>
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: align }}>
      <FormattedNumber
        value={committed}
        variant="secondary14"
        color={Number(committed) === 0 ? 'text.disabled' : 'primary.main'}
      />
      {Number(committed) > 0 && Number(committedUsd) > 0 && (
        <FormattedNumber
          value={committedUsd}
          symbol="USD"
          variant="secondary12"
          color="text.secondary"
        />
      )}
    </Box>
  );
};

const ARMING_LABEL: Record<ArmingState, { label: JSX.Element; color: string }> = {
  armed: { label: <Trans>Armed</Trans>, color: 'success.main' },
  revoked: { label: <Trans>Revoked</Trans>, color: 'warning.main' },
  'never-approved': { label: <Trans>Not armed</Trans>, color: 'text.secondary' },
};

/**
 * Whether the router can act at all. `liquidate()` opens by pulling the aToken from the
 * backstop, so an unarmed router reverts on its first line — worth stating plainly.
 */
export const ArmingBadge = ({ state }: { state?: ArmingState }) => {
  if (!state) {
    return (
      <Typography variant="secondary14" color="text.disabled">
        —
      </Typography>
    );
  }

  const { label, color } = ARMING_LABEL[state];

  return (
    <Tooltip
      title={
        state === 'armed' ? (
          <Trans>This router can cover liquidations right now.</Trans>
        ) : state === 'revoked' ? (
          <Trans>
            The allowance was set back to zero, so this router cannot cover liquidations.
          </Trans>
        ) : (
          <Trans>
            No allowance has ever been granted, so this router cannot cover liquidations yet.
          </Trans>
        )
      }
      arrow
      placement="top"
    >
      <Typography variant="secondary14" color={color}>
        {label}
      </Typography>
    </Tooltip>
  );
};

/** The router address, linked to the explorer. */
export const RouterAddress = ({ router }: { router?: UserLiquidationRouter }) => {
  const currentNetworkConfig = useRootStore((store) => store.currentNetworkConfig);

  if (!router) {
    return (
      <Typography variant="secondary14" color="text.disabled">
        <Trans>Not created</Trans>
      </Typography>
    );
  }

  return (
    <Link
      href={currentNetworkConfig.explorerLinkBuilder({ address: router.address })}
      sx={{ textDecoration: 'none' }}
    >
      <CompactableTypography
        variant="secondary14"
        color="primary.main"
        compactMode={CompactMode.MD}
      >
        {router.address}
      </CompactableTypography>
    </Link>
  );
};
