import { formatUserSummary } from '@aave/math-utils';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useRootStore } from 'src/store/root';
import { useSharedDependencies } from 'src/ui-config/SharedDependenciesProvider';

/**
 * Authoritative position data for a single borrower, read from the UiPoolDataProvider.
 *
 * The analytics table is subgraph-derived so it can cover the whole protocol cheaply, but
 * the subgraph does not populate `eModeCategoryId`. eMode raises the liquidation threshold,
 * so a subgraph-derived health factor understates an eMode user's real one — it can show a
 * position as liquidatable when it is not, and a liquidation attempted against it reverts.
 *
 * Before offering or executing a liquidation, the position is re-read here, where the true
 * eMode category is available. One RPC call for the one position that matters.
 */
export const useOnChainPosition = (borrower?: string) => {
  const { uiPoolService } = useSharedDependencies();
  const currentMarketData = useRootStore((store) => store.currentMarketData);
  const { reserves, marketReferencePriceInUsd, marketReferenceCurrencyDecimals } =
    useAppDataContext();

  return useQuery({
    queryKey: ['onChainPosition', currentMarketData.chainId, borrower?.toLowerCase()],
    enabled: !!borrower && !!reserves.length,
    // Short-lived: this backs a decision to send a transaction.
    staleTime: 15_000,
    queryFn: async () => {
      const data = await uiPoolService.getUserReservesHumanized(
        currentMarketData,
        borrower as string
      );

      const summary = formatUserSummary({
        currentTimestamp: dayjs().unix(),
        marketReferencePriceInUsd,
        marketReferenceCurrencyDecimals,
        userReserves: data.userReserves,
        formattedReserves: reserves,
        userEmodeCategoryId: data.userEmodeCategoryId,
      });

      return {
        summary,
        userEmodeCategoryId: data.userEmodeCategoryId,
        healthFactor: Number(summary.healthFactor),
      };
    },
  });
};
