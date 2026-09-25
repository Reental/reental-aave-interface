import { Trans } from '@lingui/macro';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { TopInfoPanelItem } from 'src/components/TopInfoPanel/TopInfoPanelItem';

import { useProtocolPositions } from './useProtocolPositions';

/** TopInfoPanelItem renders its own skeleton while `loading`, so values render plainly. */
const Stat = ({
  title,
  amount,
  symbol,
  loading,
}: {
  title: React.ReactNode;
  amount: number;
  symbol?: string;
  loading: boolean;
}) => (
  <TopInfoPanelItem title={title} loading={loading} hideIcon>
    <FormattedNumber
      value={amount}
      symbol={symbol}
      variant="main21"
      symbolsVariant="secondary21"
      compact
    />
  </TopInfoPanelItem>
);

export const AnalyticsTopPanel = () => {
  const { totals, isLoading } = useProtocolPositions();

  return (
    <>
      <Stat
        title={<Trans>Total collateral</Trans>}
        amount={totals.collateralUSD}
        symbol="USD"
        loading={isLoading}
      />
      <Stat
        title={<Trans>Total borrowed</Trans>}
        amount={totals.borrowsUSD}
        symbol="USD"
        loading={isLoading}
      />
      <Stat
        title={<Trans>Borrow positions</Trans>}
        amount={totals.positionCount}
        loading={isLoading}
      />
      {/* Counts only positions with collateral left to seize; see isActionable. */}
      <Stat
        title={<Trans>Liquidatable now</Trans>}
        amount={totals.actionableCount}
        loading={isLoading}
      />
      <Stat
        title={<Trans>Debt at risk</Trans>}
        amount={totals.atRiskUSD}
        symbol="USD"
        loading={isLoading}
      />
      <Stat
        title={<Trans>Bad debt</Trans>}
        amount={totals.badDebtUSD}
        symbol="USD"
        loading={isLoading}
      />
    </>
  );
};
