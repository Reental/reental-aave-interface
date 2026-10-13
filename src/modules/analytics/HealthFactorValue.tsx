import { Trans } from '@lingui/macro';
import { Typography } from '@mui/material';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';

import { UNBOUNDED_HEALTH_FACTOR } from './useProtocolPositions';

/** Colour bands matching the liquidation map: red is liquidatable or nearly so. */
const colorFor = (value: number) => {
  if (value < 1) return 'error.main';
  if (value < 1.1) return 'error.main';
  if (value < 1.25) return 'warning.main';
  return 'success.main';
};

export const HealthFactorValue = ({ value }: { value: number }) => {
  // A position with collateral but no borrowing power consumed has no liquidation point.
  if (value === UNBOUNDED_HEALTH_FACTOR) {
    return (
      <Typography variant="secondary14" color="success.main">
        ∞
      </Typography>
    );
  }

  return (
    <>
      <FormattedNumber
        value={value}
        variant="secondary14"
        color={colorFor(value)}
        visibleDecimals={2}
      />
      {value < 1 && (
        <Typography variant="secondary12" color="error.main">
          <Trans>Liquidatable</Trans>
        </Typography>
      )}
    </>
  );
};
