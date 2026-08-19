import { Trans } from '@lingui/macro';
import React from 'react';
import { ModalContextType, ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { ModalWrapper } from '../FlowCommons/ModalWrapper';
import { SupplyForLiquidationsModalContent } from './SupplyForLiquidationsModalContent';

export const SupplyForLiquidationsModal = () => {
  const { type, close, args } = useModalContext() as ModalContextType<{
    underlyingAsset: string;
    revoke?: boolean;
    liquidationRouter?: string;
  }>;

  return (
    <BasicModal open={type === ModalType.SupplyForLiquidations} setOpen={close}>
      <ModalWrapper
        action="supplyForLiquidations"
        title={<Trans>Supply</Trans>}
        underlyingAsset={args.underlyingAsset}
        keepWrappedSymbol
      >
        {(params) => (
          <SupplyForLiquidationsModalContent
            {...params}
            initialRevoke={!!args.revoke}
            routerAddress={args.liquidationRouter}
          />
        )}
      </ModalWrapper>
    </BasicModal>
  );
};
