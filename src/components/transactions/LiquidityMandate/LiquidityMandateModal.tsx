import { Trans } from '@lingui/macro';
import { Typography } from '@mui/material';
import React from 'react';
import { MandateStep, ModalContextType, ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { LiquidityMandateModalContent } from './LiquidityMandateModalContent';

const TITLES: Record<MandateStep, React.ReactElement> = {
  register: <Trans>Become a liquidity provider</Trans>,
  recipient: <Trans>Change recipient</Trans>,
  arm: <Trans>Arm your mandate</Trans>,
  budget: <Trans>Collateral budget</Trans>,
  acceptAll: <Trans>Collateral mode</Trans>,
  globalBudget: <Trans>Top up pooled budget</Trans>,
  maxDebt: <Trans>Max debt per liquidation</Trans>,
  enabled: <Trans>Participation</Trans>,
};

export const LiquidityMandateModal = () => {
  const { type, close, args } = useModalContext() as ModalContextType<{
    mandateStep?: MandateStep;
    mandateAsset?: string;
    revoke?: boolean;
  }>;

  const step = args.mandateStep ?? 'register';

  return (
    <BasicModal open={type === ModalType.LiquidityMandate} setOpen={close}>
      <Typography variant="h2" sx={{ mb: 6 }}>
        {args.revoke && step === 'arm' ? <Trans>Revoke allowance</Trans> : TITLES[step]}
      </Typography>
      <LiquidityMandateModalContent step={step} asset={args.mandateAsset} revoke={args.revoke} />
    </BasicModal>
  );
};
