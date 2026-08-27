import { Trans } from '@lingui/macro';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { formatUnits } from 'ethers/lib/utils';
import { CompactableTypography, CompactMode } from 'src/components/CompactableTypography';
import { ComputedReserveData } from 'src/hooks/app-data-provider/useAppDataProvider';
import {
  BUDGET_USD_DECIMALS,
  SkipReason,
  UNCONSTRAINED_THRESHOLD,
} from 'src/libs/reental/sharedRouter/abi';
import {
  CandidateDiagnostic,
  useCandidateDiagnostics,
} from 'src/libs/reental/sharedRouter/useCandidateDiagnostics';
import { useRootStore } from 'src/store/root';

/**
 * Every registered provider for this pair and, for the ones that cannot fund it, why.
 *
 * A pair with no matchable liquidity is almost never a shortage of capital — it is one
 * provider armed on the wrong debt asset, or one recipient missing from a whitelist. Naming
 * the gate turns an unactionable empty state into a specific fix with an owner.
 */

/**
 * An unlimited budget or a max-uint approval is a flag, not a quantity. Printing it as a
 * 29- or 78-digit figure is worse than useless: it reads as a bug and buries the numbers
 * next to it that a user actually needs to compare.
 */
const amountOrUnlimited = (value: string, decimals: number, prefix = '') => {
  if (BigInt(value) >= UNCONSTRAINED_THRESHOLD) return 'unlimited';
  return `${prefix}${formatUnits(value, decimals)}`;
};

const REASON_LABEL: Record<SkipReason, React.ReactElement> = {
  NotRegistered: <Trans>Not registered</Trans>,
  Disabled: <Trans>Paused</Trans>,
  NoCollateralBudget: <Trans>No budget for this collateral</Trans>,
  RecipientNotWhitelisted: <Trans>Recipient not whitelisted</Trans>,
  NoCapacity: <Trans>No capacity</Trans>,
};

const fixFor = (diagnostic: CandidateDiagnostic, debtSymbol: string, collateralSymbol: string) => {
  switch (diagnostic.blockedBy) {
    case 'NotRegistered':
      return <Trans>This provider has not registered on the router.</Trans>;
    case 'Disabled':
      return <Trans>The provider has paused participation.</Trans>;
    case 'NoCollateralBudget':
      return <Trans>No budget covers {collateralSymbol}. The provider must fund it.</Trans>;
    case 'RecipientNotWhitelisted':
      return (
        <Trans>
          The recipient is not approved to hold {collateralSymbol}. Reental has to whitelist it.
        </Trans>
      );
    case 'NoCapacity':
      if (diagnostic.detail === 'allowance')
        return <Trans>No {debtSymbol} approved to the router — armed on a different asset.</Trans>;
      if (diagnostic.detail === 'balance')
        return <Trans>Holds no {debtSymbol} deposit to draw on.</Trans>;
      return <Trans>Its per-liquidation cap on {debtSymbol} leaves nothing available.</Trans>;
    default:
      return null;
  }
};

export const BackstopDiagnostics = ({
  debtReserve,
  collateralReserve,
}: {
  debtReserve: ComputedReserveData;
  collateralReserve: ComputedReserveData;
}) => {
  const currentMarketData = useRootStore((store) => store.currentMarketData);

  const { data: diagnostics, isLoading } = useCandidateDiagnostics({
    marketData: currentMarketData,
    collateralAsset: collateralReserve.underlyingAsset,
    debtAsset: debtReserve.underlyingAsset,
  });

  if (isLoading || !diagnostics?.length) return null;

  const blocked = diagnostics.filter((diagnostic) => diagnostic.blockedBy);
  if (!blocked.length) return null;

  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: '6px', p: 4, mb: 4 }}>
      <Typography variant="subheader1" sx={{ mb: 1 }}>
        <Trans>Why providers are not funding this pair</Trans>
      </Typography>
      <Typography variant="helperText" color="text.muted" sx={{ display: 'block', mb: 3 }}>
        <Trans>
          {blocked.length} of {diagnostics.length} registered providers are skipped for{' '}
          {collateralReserve.symbol} / {debtReserve.symbol}.
        </Trans>
      </Typography>

      {blocked.map((diagnostic) => (
        <Stack
          key={diagnostic.lp}
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ py: 2, borderTop: 1, borderColor: 'divider', flexWrap: 'wrap', gap: 2 }}
        >
          <Box sx={{ minWidth: 0 }}>
            <CompactableTypography variant="secondary14" compactMode={CompactMode.MD}>
              {diagnostic.lp}
            </CompactableTypography>
            <Typography variant="helperText" color="text.muted" sx={{ display: 'block' }}>
              {fixFor(diagnostic, debtReserve.symbol, collateralReserve.symbol)}
            </Typography>
            {/* The three numbers behind the verdict, so it can be checked rather than trusted. */}
            <Typography variant="helperText" color="text.muted">
              <Trans>
                Budget {amountOrUnlimited(diagnostic.budgetUsd, BUDGET_USD_DECIMALS, '$')} ·
                Approved {amountOrUnlimited(diagnostic.allowance, debtReserve.decimals)} · Deposit{' '}
                {formatUnits(diagnostic.balance, debtReserve.decimals)} {debtReserve.symbol}
              </Trans>
            </Typography>
          </Box>
          <Chip
            size="small"
            color="warning"
            label={
              diagnostic.blockedBy ? REASON_LABEL[diagnostic.blockedBy] : <Trans>Skipped</Trans>
            }
          />
        </Stack>
      ))}
    </Box>
  );
};
