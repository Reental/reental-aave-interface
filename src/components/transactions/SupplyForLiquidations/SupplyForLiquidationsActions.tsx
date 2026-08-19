import { ProtocolAction } from '@aave/contract-helpers';
import { PopulatedTransaction } from '@ethersproject/contracts';
import { Trans } from '@lingui/macro';
import { BoxProps } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import React from 'react';
import { useModalContext } from 'src/hooks/useModal';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { LIQUIDATION_ROUTER_FACTORY_ABI } from 'src/libs/reental/liquidationRouter/abi';
import { useRootStore } from 'src/store/root';
import { getErrorTextFromError, TxAction } from 'src/ui-config/errorMapping';
import { queryKeysFactory } from 'src/ui-config/queries';
import { useShallow } from 'zustand/shallow';

import { TxActionsWrapper } from '../TxActionsWrapper';

interface BaseProps extends BoxProps {
  isWrongNetwork: boolean;
  symbol: string;
  chainId: number;
}

export interface CreateRouterActionsProps extends BaseProps {
  factory: string;
  aTokenAddress: string;
  underlyingAsset: string;
  onCreated: () => void;
}

/**
 * Step one for a user with no router on this reserve: deploy one from the factory.
 * backstop and collateralRecipient are both the connected wallet.
 */
export const CreateRouterActions = React.memo(
  ({
    factory,
    aTokenAddress,
    underlyingAsset,
    onCreated,
    isWrongNetwork,
    symbol,
    chainId,
    ...props
  }: CreateRouterActionsProps) => {
    const [estimateGasLimit, user] = useRootStore(
      useShallow((store) => [store.estimateGasLimit, store.account])
    );
    const { mainTxState, loadingTxns, setMainTxState, setTxError } = useModalContext();
    const { sendTx } = useWeb3Context();
    const queryClient = useQueryClient();

    const action = async () => {
      try {
        const iface = new ethers.utils.Interface(LIQUIDATION_ROUTER_FACTORY_ABI);
        const data = iface.encodeFunctionData('deploySimpleRouter', [
          user, // backstop_
          user, // collateralRecipient_
          aTokenAddress,
          underlyingAsset,
        ]);

        const tx: PopulatedTransaction = { data, to: factory, from: user };
        setMainTxState({ ...mainTxState, loading: true });
        const txWithGasEstimation = await estimateGasLimit(tx, chainId);
        const response = await sendTx(txWithGasEstimation);
        await response.wait(1);

        setMainTxState({ txHash: response.hash, loading: false, success: true });
        setTxError(undefined);
        queryClient.invalidateQueries({ queryKey: ['liquidationRouters'] });
        onCreated();
      } catch (error) {
        const parsedError = getErrorTextFromError(error, TxAction.MAIN_ACTION, false);
        setTxError(parsedError);
        setMainTxState({ txHash: undefined, loading: false });
      }
    };

    return (
      <TxActionsWrapper
        mainTxState={mainTxState}
        preparingTransactions={loadingTxns}
        handleAction={action}
        actionText={<Trans>Create liquidation router</Trans>}
        actionInProgressText={<Trans>Creating router...</Trans>}
        isWrongNetwork={isWrongNetwork}
        requiresApproval={false}
        symbol={symbol}
        {...props}
      />
    );
  }
);

export interface ApproveRouterActionsProps extends BaseProps {
  amountToApprove: string;
  aTokenAddress: string;
  router: string;
  decimals: number;
  revoke?: boolean;
}

/**
 * Approve (or revoke) the user's aTokens for their own router. The approval is the whole
 * action, so it is the main tx rather than a step preceding one.
 */
export const ApproveRouterActions = React.memo(
  ({
    amountToApprove,
    aTokenAddress,
    router,
    symbol,
    decimals,
    isWrongNetwork,
    chainId,
    revoke = false,
    ...props
  }: ApproveRouterActionsProps) => {
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
        const amount = revoke ? '0' : parseUnits(amountToApprove || '0', decimals).toString();

        let approveTxData = generateApproval(
          { spender: router, user, token: aTokenAddress, amount },
          { chainId, amount }
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
          amount,
          assetName: symbol,
        });

        queryClient.invalidateQueries({
          queryKey: queryKeysFactory.approvedAmount(user, aTokenAddress, router, chainId),
        });
        // The indexer-backed card reads the same allowance; it may lag this tx by a block
        // or two, so this refetch is a nudge rather than a guarantee of freshness.
        queryClient.invalidateQueries({ queryKey: ['liquidationRouters'] });
      } catch (error) {
        const parsedError = getErrorTextFromError(error, TxAction.MAIN_ACTION, false);
        setTxError(parsedError);
        setMainTxState({ txHash: undefined, loading: false });
      }
    };

    return (
      <TxActionsWrapper
        mainTxState={mainTxState}
        preparingTransactions={loadingTxns}
        handleAction={action}
        actionText={
          revoke ? <Trans>Revoke {symbol}</Trans> : <Trans>Supply {symbol} for liquidations</Trans>
        }
        actionInProgressText={
          revoke ? <Trans>Revoking {symbol}...</Trans> : <Trans>Approving {symbol}...</Trans>
        }
        isWrongNetwork={isWrongNetwork}
        amount={amountToApprove}
        requiresAmount={!revoke}
        requiresApproval={false}
        symbol={symbol}
        {...props}
      />
    );
  }
);
