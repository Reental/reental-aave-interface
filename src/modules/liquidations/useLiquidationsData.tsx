import { useMemo } from 'react';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useMandate } from 'src/libs/reental/sharedRouter/useMandate';
import { useRootStore } from 'src/store/root';

import { LiquidationCollateralOption, LiquidationDeposit } from './types';

/**
 * The two lists the setup flow works from: deposits that can back liquidations, and
 * collateral that can be received in exchange.
 *
 * The deposit list is narrower than "everything the user has supplied". The router pulls
 * from an aToken it has been told about, so a deposit in an unlisted reserve cannot back a
 * liquidation no matter what the user approves — offering it would produce an approval that
 * does nothing. `unsupportedDeposits` carries those rows so the UI can say why rather than
 * silently dropping them.
 */
export const useLiquidationsData = () => {
  const { user, reserves, loading } = useAppDataContext();
  const { currentAccount } = useWeb3Context();
  const currentMarketData = useRootStore((store) => store.currentMarketData);

  const collateralReserves = useMemo(
    () =>
      reserves.filter(
        (reserve) =>
          !reserve.isFrozen && !reserve.isPaused && reserve.reserveLiquidationThreshold !== '0'
      ),
    [reserves]
  );

  const { data: mandate, isLoading: mandateLoading } = useMandate({
    marketData: currentMarketData,
    user: currentAccount,
    collateralAssets: collateralReserves.map((reserve) => reserve.underlyingAsset),
  });

  const supplied = useMemo(
    () =>
      user?.userReservesData.filter((userReserve) => userReserve.underlyingBalance !== '0') ?? [],
    [user?.userReservesData]
  );

  const { deposits, unsupportedDeposits } = useMemo(() => {
    const listed = new Map(
      (mandate?.debtAssets ?? []).map((debtAsset) => [debtAsset.asset.toLowerCase(), debtAsset])
    );

    const toDeposit = (
      userReserve: (typeof supplied)[number],
      routerDebtAsset?: { aToken: string; allowance: string }
    ): LiquidationDeposit => ({
      underlyingAsset: userReserve.reserve.underlyingAsset,
      symbol: userReserve.reserve.symbol,
      iconSymbol: userReserve.reserve.iconSymbol,
      name: userReserve.reserve.name,
      underlyingBalance: userReserve.underlyingBalance,
      underlyingBalanceUSD: userReserve.underlyingBalanceUSD,
      supplyAPY: userReserve.reserve.supplyAPY,
      priceInUSD: userReserve.reserve.priceInUSD,
      aTokenAddress: routerDebtAsset?.aToken ?? userReserve.reserve.aTokenAddress,
      decimals: userReserve.reserve.decimals,
      currentAllowance: routerDebtAsset?.allowance ?? '0',
    });

    return {
      deposits: supplied
        .filter((userReserve) => listed.has(userReserve.reserve.underlyingAsset.toLowerCase()))
        .map((userReserve) =>
          toDeposit(userReserve, listed.get(userReserve.reserve.underlyingAsset.toLowerCase()))
        ),
      unsupportedDeposits: supplied
        .filter((userReserve) => !listed.has(userReserve.reserve.underlyingAsset.toLowerCase()))
        .map((userReserve) => toDeposit(userReserve)),
    };
  }, [supplied, mandate?.debtAssets]);

  const collateralOptions: LiquidationCollateralOption[] = useMemo(() => {
    const whitelist = new Map(
      (mandate?.budgets ?? []).map((budget) => [budget.asset.toLowerCase(), budget.whitelisted])
    );

    return collateralReserves.map((reserve) => ({
      underlyingAsset: reserve.underlyingAsset,
      symbol: reserve.symbol,
      iconSymbol: reserve.iconSymbol,
      name: reserve.name,
      priceInUSD: reserve.priceInUSD,
      liquidationBonus: reserve.formattedReserveLiquidationBonus,
      // Undefined rather than false while unregistered: the whitelist is checked against a
      // recipient that does not exist yet, so "not whitelisted" would be misleading.
      whitelisted: mandate?.registered
        ? whitelist.get(reserve.underlyingAsset.toLowerCase())
        : undefined,
    }));
  }, [collateralReserves, mandate?.budgets, mandate?.registered]);

  return {
    deposits,
    unsupportedDeposits,
    collateralOptions,
    mandate,
    loading: loading || mandateLoading,
  };
};
