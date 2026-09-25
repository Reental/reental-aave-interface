import { Trans } from '@lingui/macro';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { formatUnits } from 'ethers/lib/utils';
import { ComputedReserveData } from 'src/hooks/app-data-provider/useAppDataProvider';
import { BUDGET_USD_DECIMALS, SkipReason } from 'src/libs/reental/sharedRouter/abi';
import { SKIP_FIXES, useMandateActivity } from 'src/libs/reental/sharedRouter/useMandateActivity';

/**
 * What the router actually did with this mandate.
 *
 * The skips half is the point. An ineligible LP is passed over rather than reverted on, so
 * it earns nothing while every configuration screen looks healthy — `reasonName` is the
 * only place the reason is ever stated, and each one maps to a single concrete fix.
 */

const REASON_LABEL: Record<SkipReason, React.ReactElement> = {
  NotRegistered: <Trans>Not registered</Trans>,
  Disabled: <Trans>Paused</Trans>,
  NoCollateralBudget: <Trans>No budget</Trans>,
  RecipientNotWhitelisted: <Trans>Recipient not whitelisted</Trans>,
  NoCapacity: <Trans>No capacity</Trans>,
};

export const MandateActivity = ({
  user,
  reserves,
}: {
  user: string;
  reserves: ComputedReserveData[];
}) => {
  const { fills, skips } = useMandateActivity(user);

  const symbolFor = (asset: string) =>
    reserves.find((reserve) => reserve.underlyingAsset.toLowerCase() === asset.toLowerCase())
      ?.symbol ?? asset.slice(0, 10);

  // An unreachable indexer is reported by the card as a whole; here it just means no history.
  const hasFills = !!fills.data?.items.length;
  const hasSkips = !!skips.data?.items.length;

  if (!hasFills && !hasSkips) return null;

  return (
    <Box sx={{ mt: 4 }}>
      {hasSkips && (
        <>
          <Typography variant="subheader2" color="text.secondary">
            <Trans>Liquidations you were skipped in</Trans>
          </Typography>
          {skips.data?.items.slice(0, 5).map((skip) => (
            <Stack
              key={`${skip.txHash}-${skip.collateralAsset}`}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ py: 2, borderBottom: 1, borderColor: 'divider', flexWrap: 'wrap', gap: 2 }}
            >
              <Box>
                <Typography variant="secondary14">{symbolFor(skip.collateralAsset)}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {SKIP_FIXES[skip.reasonName]}
                </Typography>
              </Box>
              <Chip
                size="small"
                color="warning"
                label={REASON_LABEL[skip.reasonName] ?? skip.reasonName}
              />
            </Stack>
          ))}
        </>
      )}

      {hasFills && (
        <>
          <Typography variant="subheader2" color="text.secondary" sx={{ mt: 4 }}>
            <Trans>Collateral you received</Trans>
          </Typography>
          {fills.data?.items.slice(0, 5).map((fill) => (
            <Stack
              key={`${fill.txHash}-${fill.logIndex}`}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ py: 2, borderBottom: 1, borderColor: 'divider', flexWrap: 'wrap', gap: 2 }}
            >
              <Box>
                <Typography variant="secondary14">{symbolFor(fill.collateralAsset)}</Typography>
                <Typography variant="caption" color="text.secondary">
                  <Trans>
                    ${formatUnits(fill.collateralValueUsed, BUDGET_USD_DECIMALS)} drawn from your{' '}
                    {fill.fromGlobalBudget ? 'pooled' : 'per-asset'} budget
                  </Trans>
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                <Trans>${formatUnits(fill.collateralBudgetLeft, BUDGET_USD_DECIMALS)} left</Trans>
              </Typography>
            </Stack>
          ))}
        </>
      )}
    </Box>
  );
};
