import { PopulatedTransaction } from '@ethersproject/contracts';
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
 * One transaction against the shared liquidation router.
 *
 * The contract enforces an order — `register` first, then everything else, since every
 * other setter is behind `require(m.registered)`. That gating lives in the form; this
 * component just sends whichever call it is handed.
 */

export type MandateCall =
  | { fn: 'register'; args: [string] }
  | { fn: 'setRecipient'; args: [string] }
  | { fn: 'setEnabled'; args: [boolean] }
  | { fn: 'setCollateralBudget'; args: [string, string] }
  // Mode switch plus pooled budget, in one call. Not a top-up — see setGlobalCollateralBudget.
  | { fn: 'setAcceptAllCollateral'; args: [boolean, string] }
  // Tops the pooled budget up and leaves the mode alone.
  | { fn: 'setGlobalCollateralBudget'; args: [string] }
  | { fn: 'setMaxDebtPerLiquidation'; args: [string, string] };

interface MandateActionsProps extends BoxProps {
  call: MandateCall;
  router: string;
  chainId: number;
  isWrongNetwork: boolean;
  actionText: React.ReactElement;
  actionInProgressText: React.ReactElement;
  disabled?: boolean;
}

export const MandateActions = React.memo(
  ({
    call,
    router,
    chainId,
    isWrongNetwork,
    actionText,
    actionInProgressText,
    disabled,
    ...props
  }: MandateActionsProps) => {
    const [estimateGasLimit, user] = useRootStore(
      useShallow((store) => [store.estimateGasLimit, store.account])
    );
    const { mainTxState, loadingTxns, setMainTxState, setTxError } = useModalContext();
    const { sendTx } = useWeb3Context();
    const queryClient = useQueryClient();

    const action = async () => {
      try {
        const iface = new ethers.utils.Interface(SHARED_LIQUIDATION_ROUTER_ABI);
        const data = iface.encodeFunctionData(call.fn, call.args);

        const tx: PopulatedTransaction = { data, to: router, from: user };
        setMainTxState({ ...mainTxState, loading: true });
        const txWithGasEstimation = await estimateGasLimit(tx, chainId);
        const response = await sendTx(txWithGasEstimation);
        await response.wait(1);

        setMainTxState({ txHash: response.hash, loading: false, success: true });
        setTxError(undefined);

        // The chain reads are correct immediately; the indexed ones lag by a block or two,
        // so they are invalidated too rather than left showing the pre-transaction state.
        queryClient.invalidateQueries({ queryKey: ['sharedRouterMandate'] });
        queryClient.invalidateQueries({ queryKey: ['sharedRouterPonderMandate'] });
        queryClient.invalidateQueries({ queryKey: ['sharedRouterFunders'] });
        queryClient.invalidateQueries({ queryKey: ['sharedRouterCandidates'] });
      } catch (error) {
        const parsedError = getErrorTextFromError(error, TxAction.MAIN_ACTION, false);
        setTxError(parsedError);
        setMainTxState({ txHash: undefined, loading: false });
      }
    };

    return (
      <TxActionsWrapper
        mainTxState={mainTxState}
        preparingTransactions={loadingTxns || !!disabled}
        handleAction={action}
        actionText={actionText}
        actionInProgressText={actionInProgressText}
        isWrongNetwork={isWrongNetwork}
        requiresApproval={false}
        sx={{ mt: 0 }}
        {...props}
      />
    );
  }
);
