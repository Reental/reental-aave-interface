import { Trans } from '@lingui/macro';
import { Typography } from '@mui/material';
import React from 'react';
import { ModalContextType, ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { LiquidateModalContent } from './LiquidateModalContent';

export const LiquidateModal = () => {
  const { type, close, args } = useModalContext() as ModalContextType<{ borrower: string }>;

  return (
    <BasicModal open={type === ModalType.Liquidate} setOpen={close}>
      <Typography variant="h2" sx={{ mb: 6 }}>
        <Trans>Liquidate position</Trans>
      </Typography>
      {args.borrower && <LiquidateModalContent borrower={args.borrower} />}
    </BasicModal>
  );
};
