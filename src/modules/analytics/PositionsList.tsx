import { Trans } from '@lingui/macro';
import { Box, Button, Pagination, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { CompactableTypography, CompactMode } from 'src/components/CompactableTypography';
import { ListColumn } from 'src/components/lists/ListColumn';
import { ListHeaderTitle } from 'src/components/lists/ListHeaderTitle';
import { ListHeaderWrapper } from 'src/components/lists/ListHeaderWrapper';
import { ListItem } from 'src/components/lists/ListItem';
import { ListWrapper } from 'src/components/lists/ListWrapper';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Link } from 'src/components/primitives/Link';
import { Warning } from 'src/components/primitives/Warning';
import { TextWithTooltip } from 'src/components/TextWithTooltip';
import { useModalContext } from 'src/hooks/useModal';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';

import { DashboardContentNoData } from '../dashboard/DashboardContentNoData';
import { ListLoader } from '../dashboard/lists/ListLoader';
import { HealthFactorValue } from './HealthFactorValue';
import {
  isActionable,
  isBadDebt,
  ProtocolPosition,
  useProtocolPositions,
} from './useProtocolPositions';

/** Kept modest: the Polygon market lists hundreds of borrowers. */
const PAGE_SIZE = 25;

const HealthFactorHeader = () => (
  <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
    <Trans>Health factor</Trans>
    <TextWithTooltip iconSize={14}>
      <Typography variant="caption">
        <Trans>
          (collateral × liquidation threshold) ÷ debt. Only the liquidation-threshold share of
          collateral backs the debt, so a position holding more collateral than debt can still be
          below 1. Thresholds are listed under Risk parameters.
        </Trans>
      </Typography>
    </TextWithTooltip>
  </Box>
);

const head = [
  <Trans key="Borrower">Borrower</Trans>,
  <Trans key="Collateral">Collateral</Trans>,
  <Trans key="Debt">Debt</Trans>,
  // The formula is not obvious from the numbers: collateral can exceed debt while the
  // health factor sits below 1, because only the liquidation-threshold share of collateral
  // counts. See the risk parameters card lower down the page.
  <HealthFactorHeader key="Health factor" />,
];

const PositionRow = ({ position }: { position: ProtocolPosition }) => {
  const currentNetworkConfig = useRootStore((store) => store.currentNetworkConfig);
  const { currentAccount } = useWeb3Context();
  const { openLiquidate } = useModalContext();

  const actionable = isActionable(position);
  const badDebt = isBadDebt(position);

  return (
    <ListItem>
      <ListColumn isRow maxWidth={220}>
        <Link
          href={currentNetworkConfig.explorerLinkBuilder({ address: position.address })}
          sx={{ textDecoration: 'none' }}
        >
          <CompactableTypography
            variant="secondary14"
            color="primary.main"
            compactMode={CompactMode.MD}
          >
            {position.address}
          </CompactableTypography>
        </Link>
      </ListColumn>

      <ListColumn>
        <FormattedNumber
          value={position.totalCollateralUSD}
          symbol="USD"
          variant="secondary14"
          compact
        />
      </ListColumn>

      <ListColumn>
        <FormattedNumber
          value={position.totalBorrowsUSD}
          symbol="USD"
          variant="secondary14"
          compact
        />
      </ListColumn>

      <ListColumn>
        <HealthFactorValue value={position.healthFactor} />
      </ListColumn>

      <ListColumn maxWidth={140} minWidth={140} align="right">
        {badDebt && (
          <Typography variant="secondary12" color="text.secondary">
            <Trans>No collateral</Trans>
          </Typography>
        )}
        {actionable && (
          <Button
            variant="contained"
            size="small"
            sx={{ borderRadius: '10px' }}
            disabled={!currentAccount}
            onClick={() => openLiquidate(position.address)}
            data-cy={`liquidateButton_${position.address}`}
          >
            <Trans>Liquidate</Trans>
          </Button>
        )}
      </ListColumn>
    </ListItem>
  );
};

export const PositionsList = () => {
  const { positions, totals, isLoading, error } = useProtocolPositions();
  const theme = useTheme();
  const downToXSM = useMediaQuery(theme.breakpoints.down('xsm'));
  const [onlyAtRisk, setOnlyAtRisk] = useState(false);
  const [page, setPage] = useState(1);

  const displayed = onlyAtRisk ? positions.filter(isActionable) : positions;
  const pageCount = Math.max(1, Math.ceil(displayed.length / PAGE_SIZE));

  // A filter change, or data shrinking, can leave the current page out of range.
  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  const start = (page - 1) * PAGE_SIZE;
  const pageItems = displayed.slice(start, start + PAGE_SIZE);

  if (isLoading)
    return <ListLoader title={<Trans>Borrow positions</Trans>} head={head} withTopMargin />;

  return (
    <ListWrapper
      withTopMargin
      titleComponent={
        <Typography component="div" variant="h3" sx={{ mr: 4 }}>
          <Trans>Borrow positions</Trans>
        </Typography>
      }
      subTitleComponent={
        totals.actionableCount > 0 ? (
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              setOnlyAtRisk(!onlyAtRisk);
              setPage(1);
            }}
          >
            {onlyAtRisk ? <Trans>Show all</Trans> : <Trans>Only liquidatable</Trans>}
          </Button>
        ) : undefined
      }
      localStorageName="analyticsPositionsTableCollapse"
      noData={!displayed.length}
    >
      {!!error && (
        <Box sx={{ px: { xs: 4, xsm: 6 }, pt: 2 }}>
          <Warning severity="error" sx={{ mb: 0 }}>
            <Trans>Position data could not be loaded.</Trans>
          </Warning>
        </Box>
      )}

      {displayed.length ? (
        <>
          {!downToXSM && (
            <ListHeaderWrapper>
              {head.map((title, index) => (
                <ListColumn
                  isRow={index === 0}
                  maxWidth={index === 0 ? 220 : undefined}
                  key={`positions-head-${index}`}
                >
                  <ListHeaderTitle>{title}</ListHeaderTitle>
                </ListColumn>
              ))}
              <ListColumn maxWidth={140} minWidth={140} />
            </ListHeaderWrapper>
          )}
          {pageItems.map((position) => (
            <Fragment key={position.address}>
              <PositionRow position={position} />
            </Fragment>
          ))}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              px: { xs: 4, xsm: 6 },
              py: 3,
            }}
          >
            <Typography variant="secondary12" color="text.secondary">
              <Trans>
                Showing {start + 1}–{start + pageItems.length} of {displayed.length}
              </Trans>
            </Typography>
            {pageCount > 1 && (
              <Pagination
                count={pageCount}
                page={page}
                onChange={(_, value) => setPage(value)}
                size="small"
                shape="rounded"
                siblingCount={downToXSM ? 0 : 1}
              />
            )}
          </Box>
        </>
      ) : (
        <DashboardContentNoData
          text={
            onlyAtRisk ? (
              <Trans>No positions are liquidatable right now</Trans>
            ) : (
              <Trans>No borrow positions in this market yet</Trans>
            )
          }
        />
      )}
    </ListWrapper>
  );
};
