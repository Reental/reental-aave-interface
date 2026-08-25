import { useMemo } from 'react';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';

import { LiquidationCollateralOption, LiquidationDeposit } from './types';

export const useLiquidationsData = () => {
  const { user, reserves, loading } = useAppDataContext();

  const deposits: LiquidationDeposit[] = useMemo(
    () =>
      user?.userReservesData
        .filter((userReserve) => userReserve.underlyingBalance !== '0')
        .map((userReserve) => ({
          underlyingAsset: userReserve.reserve.underlyingAsset,
          symbol: userReserve.reserve.symbol,
          iconSymbol: userReserve.reserve.iconSymbol,
          name: userReserve.reserve.name,
          underlyingBalance: userReserve.underlyingBalance,
          underlyingBalanceUSD: userReserve.underlyingBalanceUSD,
          supplyAPY: userReserve.reserve.supplyAPY,
          priceInUSD: userReserve.reserve.priceInUSD,
        })) ?? [],
    [user?.userReservesData]
  );

  const collateralOptions: LiquidationCollateralOption[] = useMemo(
    () =>
      reserves
        .filter(
          (reserve) =>
            !reserve.isFrozen && !reserve.isPaused && reserve.reserveLiquidationThreshold !== '0'
        )
        .map((reserve) => ({
          underlyingAsset: reserve.underlyingAsset,
          symbol: reserve.symbol,
          iconSymbol: reserve.iconSymbol,
          name: reserve.name,
          priceInUSD: reserve.priceInUSD,
          liquidationBonus: reserve.formattedReserveLiquidationBonus,
        })),
    [reserves]
  );

  return { deposits, collateralOptions, loading };
};
