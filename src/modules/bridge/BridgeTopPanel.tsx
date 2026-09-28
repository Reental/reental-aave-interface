import { Trans } from '@lingui/macro';
import { Box, Typography } from '@mui/material';
import * as React from 'react';
import { PageTitle } from 'src/components/TopInfoPanel/PageTitle';

import { TopInfoPanel } from '../../components/TopInfoPanel/TopInfoPanel';

export const BridgeTopPanel = () => {
  return (
    <TopInfoPanel
      pageTitle={<></>}
      titleComponent={
        <Box>
          <PageTitle pageTitle={<Trans>Bridge</Trans>} />
          <Box sx={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="description" color="text.secondary">
              <Trans>
                Move USDC and USDT between Ethereum and Polygon. Borrow stablecoins on the Aave
                market on Ethereum and bridge them to supply in the Reental market on Polygon, or
                bridge them back to repay your debt.
              </Trans>
            </Typography>
            <Typography variant="description" color="text.secondary">
              <Trans>
                Transfers usually arrive in under a minute. Each bridge is quoted and executed by
                Uniswap and Across, and the fees are shown before you confirm.
              </Trans>
            </Typography>
          </Box>
        </Box>
      }
    />
  );
};
