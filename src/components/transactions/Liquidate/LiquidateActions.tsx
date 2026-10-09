import { PopulatedTransaction } from '@ethersproject/contracts';
import { Trans } from '@lingui/macro';
import { BoxProps } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { ethers } from 'ethers';
import React from 'react';
import { useModalContext } from 'src/hooks/useModal';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { SHARED_LIQUIDATION_ROUTER_ABI } from 'src/libs/reental/sharedRouter/abi';
import { useRootStore } from 'src/store/root';
import { getErrorTextFromError, TxAction } from 'src/ui-config/errorMapping';
import { useShallow } from 'zustand/shallow';

import { TxActionsWrapper } from '../TxActionsWrapper';

/**
 * A liquidation through the shared router.
 *
 * `candidates` is the list of LPs to draw liquidity from, in order. It is capped on-chain
 * by MAX_CANDIDATES, and an LP that cannot contribute is skipped rather than reverting the
 * whole call — so passing several candidates is normal, not a fallback.
 */
export interface LiquidationCall {
  borrower: string;
  collateralAsset: string;
  debtAsset: string;
  /** Base units of the debt asset. */
  debtToCover: string;
  candidates: string[];
}

interface LiquidateActionsProps extends BoxProps {
  call: LiquidationCall;
  router: string;
  symbol: string;
  chainId: number;
  isWrongNetwork: boolean;
  blocked: boolean;
}

export const LiquidateActions = React.memo(
  ({ call, router, symbol, chainId, isWrongNetwork, blocked, ...props }: LiquidateActionsProps) => {
    const [estimateGasLimit, user] = useRootStore(
      useShallow((store) => [store.estimateGasLimit, store.account])
    );
    const { mainTxState, loadingTxns, setMainTxState, setTxError } = useModalContext();
    const { sendTx } = useWeb3Context();
    const queryClient = useQueryClient();

    const action = async () => {
      try {
        const iface = new ethers.utils.Interface(SHARED_LIQUIDATION_ROUTER_ABI);
        const data = iface.encodeFunctionData('liquidate', [
          call.borrower,
          call.collateralAsset,
          call.debtAsset,
          call.debtToCover,
          call.candidates,
        ]);

        const tx: PopulatedTransaction = { data, to: router, from: user };
        setMainTxState({ ...mainTxState, loading: true });
        const txWithGasEstimation = await estimateGasLimit(tx, chainId);
        const response = await sendTx(txWithGasEstimation);
        await response.wait(1);

        setMainTxState({ txHash: response.hash, loading: false, success: true });
        setTxError(undefined);

        // The position, the protocol table and every LP budget just moved.
        queryClient.invalidateQueries({ queryKey: ['protocolBorrowers'] });
        queryClient.invalidateQueries({ queryKey: ['onChainPosition'] });
        queryClient.invalidateQueries({ queryKey: ['sharedRouterMandate'] });
      } catch (error) {
        const parsedError = getErrorTextFromError(error, TxAction.MAIN_ACTION, false);
        setTxError(parsedError);
        setMainTxState({ txHash: undefined, loading: false });
      }
    };

    return (
      <TxActionsWrapper
        mainTxState={mainTxState}
        preparingTransactions={loadingTxns || blocked}
        handleAction={action}
        actionText={<Trans>Liquidate</Trans>}
        actionInProgressText={<Trans>Liquidating...</Trans>}
        isWrongNetwork={isWrongNetwork}
        requiresApproval={false}
        amount={call.debtToCover}
        symbol={symbol}
        {...props}
      />
    );
  }
);
