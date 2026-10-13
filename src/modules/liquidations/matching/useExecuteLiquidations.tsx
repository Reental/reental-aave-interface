import { useQueryClient } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { useCallback, useState } from 'react';
import { ComputedReserveData } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { SHARED_LIQUIDATION_ROUTER_ABI } from 'src/libs/reental/sharedRouter/abi';
import { useRootStore } from 'src/store/root';
import { getErrorTextFromError, TxAction } from 'src/ui-config/errorMapping';
import { useShallow } from 'zustand/shallow';

import type { BookRow } from './LiquidationsMatchingBook';

/**
 * Executes the selected rows of the matching book against the shared router.
 *
 * One transaction per borrower, not one batch. The router's `liquidate()` covers a single
 * borrower and pulls from as many LPs as the debt needs, so several borrowers cannot be
 * settled in one call without a batcher contract that does not exist yet. Sequencing them
 * here keeps the flow working today; each row that succeeds stays settled even if a later
 * one fails, which a batch would have rolled back.
 */

export type ExecutionStatus = 'idle' | 'pending' | 'done' | 'failed';

export const useExecuteLiquidations = () => {
  const [estimateGasLimit, user] = useRootStore(
    useShallow((store) => [store.estimateGasLimit, store.account])
  );
  const currentMarketData = useRootStore((store) => store.currentMarketData);
  const { sendTx } = useWeb3Context();
  const queryClient = useQueryClient();

  const [statuses, setStatuses] = useState<Record<string, ExecutionStatus>>({});
  const [error, setError] = useState<string | undefined>();

  const router = currentMarketData.addresses.SHARED_LIQUIDATION_ROUTER;

  const execute = useCallback(
    async (
      rows: BookRow[],
      debtReserve: ComputedReserveData,
      collateralReserve: ComputedReserveData
    ) => {
      if (!router) return false;

      setError(undefined);
      const iface = new ethers.utils.Interface(SHARED_LIQUIDATION_ROUTER_ABI);
      const debtPrice = Number(debtReserve.priceInUSD) || 1;

      for (const row of rows) {
        setStatuses((prev) => ({ ...prev, [row.position.user]: 'pending' }));

        try {
          // The book works in USD; the contract wants debt-asset base units. Rounding down
          // keeps the call inside the close factor rather than a hair over it.
          const debtToCover = parseUnits(
            (Math.floor((row.matchableUSD / debtPrice) * 10 ** 6) / 10 ** 6).toFixed(
              Math.min(debtReserve.decimals, 6)
            ),
            debtReserve.decimals
          ).toString();

          const data = iface.encodeFunctionData('liquidate', [
            row.position.user,
            collateralReserve.underlyingAsset,
            debtReserve.underlyingAsset,
            debtToCover,
            row.slices.map((slice) => slice.owner),
          ]);

          // eslint-disable-next-line no-await-in-loop
          const withGas = await estimateGasLimit(
            { data, to: router, from: user },
            currentMarketData.chainId
          );
          // eslint-disable-next-line no-await-in-loop
          const response = await sendTx(withGas);
          // eslint-disable-next-line no-await-in-loop
          await response.wait(1);

          setStatuses((prev) => ({ ...prev, [row.position.user]: 'done' }));
        } catch (caught) {
          setStatuses((prev) => ({ ...prev, [row.position.user]: 'failed' }));
          setError(getErrorTextFromError(caught, TxAction.MAIN_ACTION, false).error?.toString());
          // Stop rather than pushing on: a revert here usually means the shared state moved
          // (another liquidator got there first), which invalidates every remaining row.
          break;
        }
      }

      queryClient.invalidateQueries({ queryKey: ['protocolBorrowers'] });
      queryClient.invalidateQueries({ queryKey: ['sharedRouterCandidates'] });
      queryClient.invalidateQueries({ queryKey: ['sharedRouterMandate'] });

      return true;
    },
    [router, estimateGasLimit, sendTx, user, currentMarketData.chainId, queryClient]
  );

  return { execute, statuses, error, router };
};
