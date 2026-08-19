import { Trans } from '@lingui/macro';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Fragment, useState } from 'react';
import { ListColumn } from 'src/components/lists/ListColumn';
import { ListHeaderTitle } from 'src/components/lists/ListHeaderTitle';
import { ListHeaderWrapper } from 'src/components/lists/ListHeaderWrapper';
import { Warning } from 'src/components/primitives/Warning';
import { TextWithTooltip } from 'src/components/TextWithTooltip';
import { AssetCapsProvider } from 'src/hooks/useAssetCaps';
import { useReentalDataContext } from 'src/libs/reental/ReentalDataProvider';

import { ListWrapper } from '../../../../components/lists/ListWrapper';
import { DASHBOARD_LIST_COLUMN_WIDTHS } from '../../../../utils/dashboardSortUtils';
import { DashboardContentNoData } from '../../DashboardContentNoData';
import { ListButtonsColumn } from '../ListButtonsColumn';
import { ListLoader } from '../ListLoader';
import { ListTopInfoItem } from '../ListTopInfoItem';
import { LiquidationRoutersListItem } from './LiquidationRoutersListItem';
import { LiquidationRoutersListMobileItem } from './LiquidationRoutersListMobileItem';
import { useLiquidationRouterPositions } from './useLiquidationRouterPositions';

const head = [
  <Trans key="Asset">Asset</Trans>,
  <Trans key="Supplied">Supplied</Trans>,
  <Trans key="Supplied for liquidations">Supplied for liquidations</Trans>,
  <Trans key="Status">Status</Trans>,
  <Trans key="Router">Router</Trans>,
];

interface LiquidationRoutersListProps {
  /**
   * Matches the dashboard convention where every card but the first in a column carries
   * its own top margin. Set to false when this card is placed first.
   */
  withTopMargin?: boolean;
}

/**
 * Lets a user commit the aTokens of their borrowable positions to a liquidation router
 * they back, and see the routers they already own.
 *
 * Self-contained: it takes no data props, so it can be dropped into either dashboard
 * column or another page without rewiring.
 */
export const LiquidationRoutersList = ({ withTopMargin = true }: LiquidationRoutersListProps) => {
  const {
    twoFA: {
      global: { status: is2FAEnabled },
    },
  } = useReentalDataContext();
  const theme = useTheme();
  const downToXSM = useMediaQuery(theme.breakpoints.down('xsm'));
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const {
    factory,
    positions,
    totalCommittedUsd,
    hasUnlimited,
    armedCount,
    routerCount,
    isLoading,
    isIndexerOffline,
    error,
  } = useLiquidationRouterPositions();

  // Markets without a factory cannot host routers at all, so the card is not rendered.
  if (!factory) return null;

  // Nothing about liquidations is shown until the user has something to commit. A user
  // with no supplied position and no existing router sees no trace of the feature —
  // not an empty card, not a placeholder.
  //
  // The offline case is deliberately exempt: `positions` is also empty when the indexer
  // is unreachable, and silently unmounting there would tell a user who DOES back routers
  // that they have none.
  if (!positions.length && !isIndexerOffline) return null;

  if (isLoading)
    return (
      <ListLoader
        title={<Trans>Supply for liquidations</Trans>}
        head={head}
        withTopMargin={withTopMargin}
      />
    );

  return (
    <ListWrapper
      withTopMargin={withTopMargin}
      tooltipOpen={tooltipOpen}
      titleComponent={
        <Typography component="div" variant="h3" sx={{ mr: 4 }}>
          <Trans>Supply for liquidations</Trans>
        </Typography>
      }
      subTitleComponent={
        <TextWithTooltip open={tooltipOpen} setOpen={setTooltipOpen}>
          <Trans>
            Each borrowable asset can be committed to a liquidation router you back. The router uses
            the aTokens you approve to cover liquidations, and only ever sends the seized collateral
            to its fixed recipient. A router can only act once you have approved it — until then it
            is shown as not armed.
          </Trans>
        </TextWithTooltip>
      }
      localStorageName="liquidationRoutersDashboardTableCollapse"
      noData={!positions.length}
      topInfo={
        !!positions.length && (
          <>
            <ListTopInfoItem
              title={<Trans>Supplied for liquidations</Trans>}
              value={totalCommittedUsd.toNumber()}
            />
            <ListTopInfoItem
              title={<Trans>Armed routers</Trans>}
              value={`${armedCount}/${routerCount}`}
            />
          </>
        )
      }
    >
      {/* An unreachable indexer must never look like "you have no routers". */}
      {isIndexerOffline && (
        <Box sx={{ px: { xs: 4, xsm: 6 }, pt: 2 }}>
          <Warning severity="error" sx={{ mb: 0 }}>
            <Trans>
              The liquidation indexer is unreachable, so routers cannot be listed. Any routers you
              own still exist on-chain.
            </Trans>
          </Warning>
        </Box>
      )}

      {!isIndexerOffline && !!error && (
        <Box sx={{ px: { xs: 4, xsm: 6 }, pt: 2 }}>
          <Warning severity="warning" sx={{ mb: 0 }}>
            <Trans>Router data could not be loaded. The list below may be incomplete.</Trans>
          </Warning>
        </Box>
      )}

      {hasUnlimited && (
        <Box sx={{ px: { xs: 4, xsm: 6 }, pt: 2 }}>
          <Warning severity="info" sx={{ mb: 0 }}>
            <Trans>One or more approvals are unlimited, so the total above excludes them.</Trans>
          </Warning>
        </Box>
      )}

      {positions.length ? (
        <>
          {!downToXSM && (
            <ListHeaderWrapper>
              {head.map((title, index) => (
                <ListColumn
                  isRow={index === 0}
                  maxWidth={index === 0 ? DASHBOARD_LIST_COLUMN_WIDTHS.ASSET : undefined}
                  key={`liquidation-routers-head-${index}`}
                >
                  <ListHeaderTitle>{title}</ListHeaderTitle>
                </ListColumn>
              ))}
              <ListButtonsColumn isColumnHeader />
            </ListHeaderWrapper>
          )}
          {positions.map((position) =>
            position.reserve ? (
              <Fragment key={position.key}>
                <AssetCapsProvider asset={position.reserve}>
                  {downToXSM ? (
                    <LiquidationRoutersListMobileItem {...position} is2FAEnabled={is2FAEnabled} />
                  ) : (
                    <LiquidationRoutersListItem {...position} is2FAEnabled={is2FAEnabled} />
                  )}
                </AssetCapsProvider>
              </Fragment>
            ) : (
              // No reserve to provide caps context, so the row renders without it.
              <Fragment key={position.key}>
                {downToXSM ? (
                  <LiquidationRoutersListMobileItem {...position} is2FAEnabled={is2FAEnabled} />
                ) : (
                  <LiquidationRoutersListItem {...position} is2FAEnabled={is2FAEnabled} />
                )}
              </Fragment>
            )
          )}
        </>
      ) : (
        <DashboardContentNoData
          text={
            isIndexerOffline ? (
              <Trans>Router data unavailable</Trans>
            ) : (
              <Trans>No borrowable assets in this market</Trans>
            )
          }
        />
      )}
    </ListWrapper>
  );
};
