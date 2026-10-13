import { ProtocolAction } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import { BoxProps } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { parseUnits } from 'ethers/lib/utils';
import React from 'react';
import { useModalContext } from 'src/hooks/useModal';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';
import { getErrorTextFromError, TxAction } from 'src/ui-config/errorMapping';
import { useShallow } from 'zustand/shallow';

import { TxActionsWrapper } from '../TxActionsWrapper';

/**
 * Approves the LP's aTokens to the shared router — this is what actually arms them.
 *
 * `liquidate()` pulls the aToken from the LP on its first line, so a registered LP with a
 * budget but no allowance still contributes nothing. Revoking is the same call with 0.
 */
interface ArmActionsProps extends BoxProps {
  aTokenAddress: string;
  router: string;
  amount: string;
  decimals: number;
  symbol: string;
  chainId: number;
  isWrongNetwork: boolean;
  revoke?: boolean;
  disabled?: boolean;
}

export const ArmActions = React.memo(
  ({
    aTokenAddress,
    router,
    amount,
    decimals,
    symbol,
    chainId,
    isWrongNetwork,
    revoke = false,
    disabled,
    ...props
  }: ArmActionsProps) => {
    const [generateApproval, estimateGasLimit, addTransaction, user] = useRootStore(
      useShallow((store) => [
        store.generateApproval,
        store.estimateGasLimit,
        store.addTransaction,
        store.account,
      ])
    );
    const { mainTxState, loadingTxns, setMainTxState, setTxError } = useModalContext();
    const { sendTx } = useWeb3Context();
    const queryClient = useQueryClient();

    const action = async () => {
      try {
        const value = revoke ? '0' : parseUnits(amount || '0', decimals).toString();

        let approveTxData = generateApproval(
          { spender: router, user, token: aTokenAddress, amount: value },
          { chainId, amount: value }
        );

        setMainTxState({ ...mainTxState, loading: true });
        approveTxData = await estimateGasLimit(approveTxData, chainId);
        const response = await sendTx(approveTxData);
        await response.wait(1);

        setMainTxState({ txHash: response.hash, loading: false, success: true });
        setTxError(undefined);

        addTransaction(response.hash, {
          action: ProtocolAction.approval,
          txState: 'success',
          asset: aTokenAddress,
          amount: value,
          assetName: symbol,
        });

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
        preparingTransactions={loadingTxns || !!disabled}
        handleAction={action}
        actionText={revoke ? <Trans>Revoke {symbol}</Trans> : <Trans>Arm with {symbol}</Trans>}
        actionInProgressText={
          revoke ? <Trans>Revoking {symbol}...</Trans> : <Trans>Approving {symbol}...</Trans>
        }
        isWrongNetwork={isWrongNetwork}
        requiresApproval={false}
        requiresAmount={!revoke}
        amount={amount}
        symbol={symbol}
        sx={{ mt: 0 }}
        {...props}
      />
    );
  }
);
