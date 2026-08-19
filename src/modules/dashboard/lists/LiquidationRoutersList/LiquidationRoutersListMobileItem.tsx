import { Trans } from '@lingui/macro';
import { Box, Button } from '@mui/material';
import { Row } from 'src/components/primitives/Row';

import { ListMobileItemWrapper } from '../ListMobileItemWrapper';
import { ListValueRow } from '../ListValueRow';
import { ArmingBadge, CommittedAmount, RouterAddress } from './LiquidationRouterInfo';
import { LiquidationRouterItem } from './types';
import { useLiquidationRouterActions } from './useLiquidationRouterActions';

export const LiquidationRoutersListMobileItem = (props: LiquidationRouterItem) => {
  const { symbol, iconSymbol, name, underlyingAsset, underlyingBalance, underlyingBalanceUSD } =
    props;
  const { router, armingState, reserve } = props;
  const { currentMarket, disableAction, disableRevoke, canRevoke, actionLabel, openModal } =
    useLiquidationRouterActions(props);

  return (
    <ListMobileItemWrapper
      symbol={symbol}
      iconSymbol={iconSymbol}
      name={name}
      underlyingAsset={underlyingAsset}
      currentMarket={currentMarket}
      frozen={reserve?.isFrozen}
    >
      <ListValueRow
        title={<Trans>Supply balance</Trans>}
        value={Number(underlyingBalance)}
        subValue={Number(underlyingBalanceUSD)}
        disabled={Number(underlyingBalance) === 0}
      />

      <Row
        caption={<Trans>Supplied for liquidations</Trans>}
        align="flex-start"
        captionVariant="description"
        mb={2}
      >
        <CommittedAmount position={props} align="flex-end" />
      </Row>

      <Row caption={<Trans>Status</Trans>} align="center" captionVariant="description" mb={2}>
        <ArmingBadge state={armingState} />
      </Row>

      <Row caption={<Trans>Router</Trans>} align="center" captionVariant="description" mb={2}>
        <RouterAddress router={router} />
      </Row>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 5 }}>
        {canRevoke && (
          <Button
            disabled={disableRevoke}
            variant="outlined"
            onClick={() => openModal(true)}
            sx={{ mr: 1.5, borderRadius: '10px' }}
            fullWidth
          >
            <Trans>Revoke</Trans>
          </Button>
        )}
        <Button
          disabled={disableAction}
          variant="contained"
          onClick={() => openModal()}
          sx={{ borderRadius: '10px' }}
          fullWidth
        >
          {actionLabel}
        </Button>
      </Box>
    </ListMobileItemWrapper>
  );
};
