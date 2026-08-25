import { Trans } from '@lingui/macro';
import { Box, Button, Chip, Divider, Typography } from '@mui/material';
import { BasicModal } from 'src/components/primitives/BasicModal';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Row } from 'src/components/primitives/Row';
import { TokenIcon } from 'src/components/primitives/TokenIcon';
import { ComputedReserveData } from 'src/hooks/app-data-provider/useAppDataProvider';

import type { BookRow } from './LiquidationsMatchingBook';

interface LiquidationsExecuteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  rows: BookRow[];
  debtReserve: ComputedReserveData;
  collateralReserve: ComputedReserveData;
  onConfirm: () => void;
}

export const LiquidationsExecuteModal = ({
  open,
  setOpen,
  rows,
  debtReserve,
  collateralReserve,
  onConfirm,
}: LiquidationsExecuteModalProps) => {
  const liquidationBonus = Number(collateralReserve.formattedReserveLiquidationBonus) || 0;
  const collateralPrice = Number(collateralReserve.priceInUSD) || 1;
  const debtPrice = Number(debtReserve.priceInUSD) || 1;

  const totalRepayUSD = rows.reduce((acc, r) => acc + r.matchableUSD, 0);
  const totalReceiveUSD = totalRepayUSD * (1 + liquidationBonus);
  const totalCalls = rows.reduce((acc, r) => acc + r.slices.length, 0);

  return (
    <BasicModal open={open} setOpen={setOpen} contentMaxWidth={480}>
      <Typography variant="h2" sx={{ mb: 1 }}>
        {rows.length > 1 ? (
          <Trans>Execute {rows.length} liquidations</Trans>
        ) : (
          <Trans>Execute liquidation</Trans>
        )}
      </Typography>
      <Typography variant="description" color="text.secondary" sx={{ mb: 5, display: 'block' }}>
        <Trans>
          Repay {debtReserve.symbol} debt with backstop deposits and seize{' '}
          {collateralReserve.symbol} with its liquidation bonus.
        </Trans>
      </Typography>

      <Box sx={{ maxHeight: '380px', overflowY: 'auto', pr: 1 }}>
        {rows.map((row) => {
          const receiveUSD = row.matchableUSD * (1 + liquidationBonus);
          return (
            <Box
              key={row.position.user}
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: '6px',
                p: 4,
                '&:not(:last-child)': { mb: 3 },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 3,
                }}
              >
                <Typography variant="secondary14">{row.position.user}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography
                    variant="main14"
                    color={row.position.healthFactor < 0.95 ? 'error.main' : 'warning.main'}
                  >
                    HF {row.position.healthFactor.toFixed(3)}
                  </Typography>
                  <Chip
                    label={row.coverage === 'total' ? <Trans>Total</Trans> : <Trans>Partial</Trans>}
                    size="small"
                    variant="outlined"
                    color={row.coverage === 'total' ? 'success' : 'warning'}
                    sx={{ height: '20px', fontSize: '11px' }}
                  />
                </Box>
              </Box>

              <Row caption={<Trans>Repay</Trans>} captionVariant="description" mb={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <TokenIcon symbol={debtReserve.iconSymbol} sx={{ fontSize: '16px' }} />
                  <FormattedNumber value={row.matchableUSD / debtPrice} variant="secondary14" />
                  <FormattedNumber
                    value={row.matchableUSD}
                    symbol="USD"
                    variant="secondary12"
                    color="text.secondary"
                  />
                </Box>
              </Row>

              <Row
                caption={<Trans>Receive (incl. bonus)</Trans>}
                captionVariant="description"
                mb={3}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <TokenIcon symbol={collateralReserve.iconSymbol} sx={{ fontSize: '16px' }} />
                  <FormattedNumber value={receiveUSD / collateralPrice} variant="secondary14" />
                  <FormattedNumber
                    value={receiveUSD}
                    symbol="USD"
                    variant="secondary12"
                    color="text.secondary"
                  />
                </Box>
              </Row>

              <Typography variant="helperText" color="text.muted" sx={{ mb: 1, display: 'block' }}>
                <Trans>Funded by {row.slices.length} backstop positions</Trans>
              </Typography>
              {row.slices.map((slice) => (
                <Box
                  key={slice.owner}
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}
                >
                  <Typography variant="secondary12" color="text.secondary">
                    {slice.owner}
                  </Typography>
                  <FormattedNumber value={slice.amountUSD} symbol="USD" variant="secondary12" />
                </Box>
              ))}
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ my: 4 }} />

      <Row caption={<Trans>Total to repay</Trans>} captionVariant="description" mb={1}>
        <FormattedNumber value={totalRepayUSD} symbol="USD" variant="secondary14" />
      </Row>
      <Row caption={<Trans>Total to receive</Trans>} captionVariant="description" mb={5}>
        <FormattedNumber
          value={totalReceiveUSD}
          symbol="USD"
          variant="secondary14"
          color="success.main"
        />
      </Row>

      <Button variant="contained" size="large" fullWidth onClick={onConfirm}>
        <Trans>Execute</Trans>
      </Button>
      <Typography
        variant="helperText"
        color="text.muted"
        sx={{ display: 'block', textAlign: 'center', mt: 2 }}
      >
        <Trans>
          Single transaction · {rows.length} liquidations · {totalCalls} backstop matches
        </Trans>
      </Typography>
    </BasicModal>
  );
};
