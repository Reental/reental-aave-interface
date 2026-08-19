import { Trans } from '@lingui/macro';
import { Button, Tooltip } from '@mui/material';
import { ListColumn } from 'src/components/lists/ListColumn';

import { ListButtonsColumn } from '../ListButtonsColumn';
import { ListItemWrapper } from '../ListItemWrapper';
import { ListValueColumn } from '../ListValueColumn';
import { ArmingBadge, CommittedAmount, RouterAddress } from './LiquidationRouterInfo';
import { LiquidationRouterItem } from './types';
import { useLiquidationRouterActions } from './useLiquidationRouterActions';

export const LiquidationRoutersListItem = (props: LiquidationRouterItem) => {
  const { symbol, iconSymbol, name, underlyingAsset, underlyingBalance, underlyingBalanceUSD } =
    props;
  const { router, armingState, reserve } = props;
  const {
    currentMarket,
    orphaned,
    disableAction,
    disableRevoke,
    canRevoke,
    actionLabel,
    openModal,
  } = useLiquidationRouterActions(props);

  return (
    <ListItemWrapper
      symbol={symbol}
      iconSymbol={iconSymbol}
      name={name}
      detailsAddress={underlyingAsset}
      currentMarket={currentMarket}
      frozen={reserve?.isFrozen}
      paused={reserve?.isPaused}
      data-cy={`dashboardLiquidationRouterListItem_${symbol.toUpperCase()}`}
    >
      <ListValueColumn
        symbol={iconSymbol}
        value={Number(underlyingBalance)}
        subValue={Number(underlyingBalanceUSD)}
        disabled={Number(underlyingBalance) === 0}
      />

      <ListColumn>
        <CommittedAmount position={props} />
      </ListColumn>

      <ListColumn>
        <ArmingBadge state={armingState} />
      </ListColumn>

      <ListColumn>
        <RouterAddress router={router} />
      </ListColumn>

      <ListButtonsColumn>
        {canRevoke && (
          <Button
            disabled={disableRevoke}
            variant="outlined"
            sx={{ borderRadius: '10px' }}
            onClick={() => openModal(true)}
            data-cy="revokeForLiquidationsButton"
          >
            <Trans>Revoke</Trans>
          </Button>
        )}
        <Tooltip
          title={orphaned ? <Trans>This asset is not a reserve of the current market.</Trans> : ''}
          arrow
          placement="top"
        >
          <span>
            <Button
              disabled={disableAction}
              variant="contained"
              sx={{ borderRadius: '10px' }}
              onClick={() => openModal()}
              data-cy="supplyForLiquidationsButton"
            >
              {actionLabel}
            </Button>
          </span>
        </Tooltip>
      </ListButtonsColumn>
    </ListItemWrapper>
  );
};
