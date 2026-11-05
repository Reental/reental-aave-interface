import { useQueryClient } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { useCallback, useState } from 'react';
import { ComputedReserveData } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { SHARED_LIQUIDATION_ROUTER_ABI } from 'src/libs/reental/sharedRouter/abi';
import {
  fetchDebtToCover,
  simulateLiquidate,
} from 'src/libs/reental/sharedRouter/fetchDebtToCover';
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
      const provider = useRootStore.getState().jsonRpcProvider(currentMarketData.chainId);
      const candidates = (row: BookRow) => row.slices.map((slice) => slice.owner);

      for (const row of rows) {
        setStatuses((prev) => ({ ...prev, [row.position.user]: 'pending' }));

        try {
          // Backstop capacity for this borrower, in debt base units. It caps debtToCover from
          // below; Aave's close-factor and collateral limits cap it from above. The book works
          // in USD, so convert and round down to stay inside the close factor.
          const capacity = parseUnits(
            (Math.floor((row.matchableUSD / debtPrice) * 10 ** 6) / 10 ** 6).toFixed(
              Math.min(debtReserve.decimals, 6)
            ),
            debtReserve.decimals
          ).toBigInt();

          // Size debtToCover to exactly what Aave will repay. The router pulls LP aTokens for
          // the full amount and never refunds the allowance it overspends, so asking for more
          // than Aave repays permanently burns an LP's approval.
          // eslint-disable-next-line no-await-in-loop
          const sizing = await fetchDebtToCover({
            provider,
            router,
            borrower: row.position.user,
            collateralAsset: collateralReserve.underlyingAsset,
            debtAsset: debtReserve.underlyingAsset,
            fallbackPool: currentMarketData.addresses.LENDING_POOL,
            userAmount: capacity,
          });

          if (!sizing.liquidatable) {
            setStatuses((prev) => ({ ...prev, [row.position.user]: 'failed' }));
            setError('This borrower is no longer liquidatable (health factor is at or above 1).');
            continue;
          }
          if (sizing.usedFallback) {
            // eslint-disable-next-line no-console
            console.warn(
              `[liquidations] unexpected pool revision; using full-debt debtToCover for ${row.position.user}`
            );
          }
          if (sizing.debtToCover === BigInt(0)) {
            setStatuses((prev) => ({ ...prev, [row.position.user]: 'failed' }));
            setError('Nothing to liquidate for this borrower at the current price.');
            continue;
          }

          let debtToCover = sizing.debtToCover;

          // Dry-run before broadcasting: surface the revert reason instead of burning gas, and
          // adopt the exact repay amount the router reports when it gives one back.
          // eslint-disable-next-line no-await-in-loop
          const sim = await simulateLiquidate({
            provider,
            router,
            from: user as string,
            borrower: row.position.user,
            collateralAsset: collateralReserve.underlyingAsset,
            debtAsset: debtReserve.underlyingAsset,
            debtToCover,
            candidates: candidates(row),
          });
          if (!sim.ok) {
            setStatuses((prev) => ({ ...prev, [row.position.user]: 'failed' }));
            setError(sim.reason);
            break;
          }
          if (
            sim.debtCovered !== undefined &&
            sim.debtCovered > BigInt(0) &&
            sim.debtCovered <= debtToCover
          ) {
            debtToCover = sim.debtCovered;
          }

          const data = iface.encodeFunctionData('liquidate', [
            row.position.user,
            collateralReserve.underlyingAsset,
            debtReserve.underlyingAsset,
            debtToCover.toString(),
            candidates(row),
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
    [
      router,
      estimateGasLimit,
      sendTx,
      user,
      currentMarketData.chainId,
      currentMarketData.addresses.LENDING_POOL,
      queryClient,
    ]
  );

  return { execute, statuses, error, router };
};
