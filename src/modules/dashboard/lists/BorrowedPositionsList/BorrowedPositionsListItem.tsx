import { ProtocolAction } from '@aave/contract-helpers';
import { ReserveIncentiveResponse } from '@aave/math-utils/dist/esm/formatters/incentive/calculate-reserve-incentives';
import { Trans } from '@lingui/macro';
import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import { IncentivesCard } from 'src/components/incentives/IncentivesCard';
import { Row } from 'src/components/primitives/Row';
import { useAssetCaps } from 'src/hooks/useAssetCaps';
import { useModalContext } from 'src/hooks/useModal';
import { useRootStore } from 'src/store/root';
import { DashboardReserve } from 'src/utils/dashboardSortUtils';
import { displayGhoForMintableMarket } from 'src/utils/ghoUtilities';
import { showExternalIncentivesTooltip } from 'src/utils/utils';

import { ListAPRColumn, ListGhoAPRColumn } from '../ListAPRColumn';
import { ListButtonsColumn } from '../ListButtonsColumn';
import { ListItemWrapper } from '../ListItemWrapper';
import { ListMobileItemWrapper } from '../ListMobileItemWrapper';
import { ListValueColumn } from '../ListValueColumn';
import { ListValueRow } from '../ListValueRow';

export interface BorrowedPositionsListItem {
  item: DashboardReserve;
  disableEModeSwitch: boolean;
}

export const BorrowedPositionsListItem = ({ item }: BorrowedPositionsListItem) => {
  const { borrowCap } = useAssetCaps();
  const currentMarket = useRootStore((state) => state.currentMarket);
  const theme = useTheme();
  const downToXSM = useMediaQuery(theme.breakpoints.down('xsm'));
  const { openBorrow, openRepay } = useModalContext();

  const reserve = item.reserve;

  const disableBorrow =
    !reserve.isActive ||
    !reserve.borrowingEnabled ||
    reserve.isFrozen ||
    reserve.isPaused ||
    borrowCap.isMaxed;

  const disableRepay = !reserve.isActive || reserve.isPaused;

  const props: BorrowedPositionsListItemProps = {
    ...item,
    disableBorrow,
    disableRepay,
    totalBorrows: item.variableBorrows,
    totalBorrowsUSD: item.variableBorrowsUSD,
    borrowAPY: Number(reserve.variableBorrowAPY),
    incentives: reserve.vIncentivesData,
    variableDebtTokenAddress: reserve.variableDebtTokenAddress,
    onOpenBorrow: () => {
      openBorrow(reserve.underlyingAsset, currentMarket, reserve.name, 'dashboard');
    },
    onOpenRepay: () => {
      openRepay(
        reserve.underlyingAsset,
        reserve.isFrozen,
        currentMarket,
        reserve.name,
        'dashboard'
      );
    },
  };

  if (downToXSM) {
    return <BorrowedPositionsListItemMobile {...props} />;
  } else {
    return <BorrowedPositionsListItemDesktop {...props} />;
  }
};

interface BorrowedPositionsListItemProps extends DashboardReserve {
  disableBorrow: boolean;
  disableRepay: boolean;
  borrowAPY: number;
  incentives: ReserveIncentiveResponse[] | undefined;
  onOpenBorrow: () => void;
  onOpenRepay: () => void;
}

const BorrowedPositionsListItemDesktop = ({
  reserve,
  disableBorrow,
  disableRepay,
  totalBorrows,
  totalBorrowsUSD,
  borrowAPY,
  variableDebtTokenAddress,
  incentives,
  onOpenBorrow,
  onOpenRepay,
}: BorrowedPositionsListItemProps) => {
  const currentMarket = useRootStore((state) => state.currentMarket);

  const isGho = displayGhoForMintableMarket({
    symbol: reserve.symbol,
    currentMarket,
  });

  return (
    <ListItemWrapper
      symbol={reserve.symbol}
      iconSymbol={reserve.iconSymbol}
      name={reserve.name}
      detailsAddress={reserve.underlyingAsset}
      currentMarket={currentMarket}
      frozen={reserve.isFrozen}
      paused={reserve.isPaused}
      borrowEnabled={reserve.borrowingEnabled}
      data-cy={`dashboardBorrowedListItem_${reserve.symbol.toUpperCase()}`}
      showBorrowCapTooltips
      showExternalIncentivesTooltips={showExternalIncentivesTooltip(
        reserve.symbol,
        currentMarket,
        ProtocolAction.borrow
      )}
    >
      <ListValueColumn symbol={reserve.symbol} value={totalBorrows} subValue={totalBorrowsUSD} />

      {isGho ? (
        <ListGhoAPRColumn
          value={borrowAPY}
          market={currentMarket}
          protocolAction={ProtocolAction.borrow}
          address={variableDebtTokenAddress}
          incentives={incentives}
          symbol={reserve.symbol}
        />
      ) : (
        <ListAPRColumn
          value={borrowAPY}
          market={currentMarket}
          protocolAction={ProtocolAction.borrow}
          address={variableDebtTokenAddress}
          incentives={incentives}
          symbol={reserve.symbol}
        />
      )}

      <ListButtonsColumn>
        <Button disabled={disableBorrow} variant="contained" onClick={onOpenBorrow}>
          <Trans>Borrow</Trans>
        </Button>
        <Button disabled={disableRepay} variant="outlined" onClick={onOpenRepay}>
          <Trans>Repay</Trans>
        </Button>
      </ListButtonsColumn>
    </ListItemWrapper>
  );
};

const BorrowedPositionsListItemMobile = ({
  reserve,
  totalBorrows,
  totalBorrowsUSD,
  disableBorrow,
  borrowAPY,
  incentives,
  variableDebtTokenAddress,
  disableRepay,
  onOpenBorrow,
  onOpenRepay,
}: BorrowedPositionsListItemProps) => {
  const currentMarket = useRootStore((state) => state.currentMarket);

  const { symbol, iconSymbol, name } = reserve;

  return (
    <ListMobileItemWrapper
      symbol={symbol}
      iconSymbol={iconSymbol}
      name={name}
      underlyingAsset={reserve.underlyingAsset}
      currentMarket={currentMarket}
      frozen={reserve.isFrozen}
      borrowEnabled={reserve.borrowingEnabled}
      showBorrowCapTooltips
      showExternalIncentivesTooltips={showExternalIncentivesTooltip(
        symbol,
        currentMarket,
        ProtocolAction.borrow
      )}
    >
      <ListValueRow
        title={<Trans>Debt</Trans>}
        value={totalBorrows}
        subValue={totalBorrowsUSD}
        disabled={Number(totalBorrows) === 0}
      />

      <Row caption={<Trans>APY</Trans>} align="flex-start" captionVariant="description" mb={2}>
        <IncentivesCard
          value={borrowAPY}
          incentives={incentives}
          address={variableDebtTokenAddress}
          symbol={symbol}
          variant="secondary14"
          market={currentMarket}
          protocolAction={ProtocolAction.borrow}
        />
      </Row>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 5 }}>
        <Button disabled={disableBorrow} variant="contained" onClick={onOpenBorrow} fullWidth>
          <Trans>Borrow</Trans>
        </Button>
        <Button
          disabled={disableRepay}
          variant="outlined"
          onClick={onOpenRepay}
          sx={{ ml: 1.5 }}
          fullWidth
        >
          <Trans>Repay</Trans>
        </Button>
      </Box>
    </ListMobileItemWrapper>
  );
};
