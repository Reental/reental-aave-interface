import React, { PropsWithChildren, useContext, useMemo } from 'react';
import { TwoFABanner } from 'src/components/Reental/TwoFABanner/TwoFABanner';
import { TwoFACountdown } from 'src/components/Reental/TwoFACoundown/TwoFACountdown';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useWalletBalances } from 'src/hooks/app-data-provider/useWalletBalances';
import { useRootStore } from 'src/store/root';
import { selectIsMigrationAvailable } from 'src/store/v3MigrationSelectors';
import { maxUint160 } from 'viem';
import { useShallow } from 'zustand/shallow';

import { useWeb3Context } from '../hooks/useWeb3Context';
import { use2FA } from './2fa/services';

export interface ReentalDataProvider {
  twoFA: {
    global: {
      status: boolean;
      expiresAt: Date;
      windowTime: number;
    };
    [asset: string]: {
      status: boolean;
      expiresAt: Date;
      windowTime: number;
    };
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchGlobal2FA: () => Promise<any>;
}

const Wrapper = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ReentalDataProvider;
}) => {
  const currentMarketData = useRootStore((store) => store.currentMarketData);
  const { walletBalances, loading } = useWalletBalances(currentMarketData);
  const { userReserves, loading: loadingUserReserves } = useAppDataContext();

  const asCollateralEnabled = userReserves.filter(
    (userReserve) => userReserve.usageAsCollateralEnabledOnUser
  );
  const enable2FA = asCollateralEnabled.some((userReserve) => {
    const underlyingAsset = userReserve.underlyingAsset;
    const hasBalance = walletBalances[underlyingAsset]?.amount !== '0';
    const hasReserve = userReserve.scaledATokenBalance !== '0';
    return hasBalance && hasReserve;
  });

  const { fetchGlobal2FA } = value;
  const { status: isTwoFAEnabled, expiresAt, windowTime } = value.twoFA.global;

  const showBanner = loading || loadingUserReserves || (enable2FA && !isTwoFAEnabled);
  const showCountdown = enable2FA && isTwoFAEnabled;

  return (
    <div>
      {showBanner && <TwoFABanner />}
      {showCountdown && expiresAt && (
        <TwoFACountdown
          windowTime={windowTime}
          expirationDate={expiresAt}
          fetchOnEnd={fetchGlobal2FA}
        />
      )}
      {children}
    </div>
  );
};

const ReentalDataContext = React.createContext<ReentalDataProvider>({
  twoFA: {
    global: {
      status: false,
      expiresAt: new Date(),
    },
  },
  fetchGlobal2FA: () => Promise.resolve(),
} as ReentalDataProvider);

export const ReentalDataProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [, , currentMarketData] = useRootStore(
    useShallow((store) => [
      store.trackEvent,
      store.currentNetworkConfig,
      store.currentMarketData,
      store.currentMarket,
      selectIsMigrationAvailable(store),
    ])
  );
  const { currentAccount } = useWeb3Context();
  const defaultEveryTokenAddress = `0x${maxUint160.toString(16)}`;
  const { data: global2FAData, refetch: refetchGlobal2FA } = use2FA({
    chainId: currentMarketData.chainId,
    asset: defaultEveryTokenAddress,
    user: currentAccount,
  });

  const value = useMemo(() => {
    const global2FA = {
      status: false,
      expiresAt: new Date(),
      windowTime: 0,
    };

    if (global2FAData?.twoFaAccount) {
      const expiresAt = new Date(global2FAData.twoFaAccount.expiresAt * 1000);
      const updatedAt = new Date(global2FAData.twoFaAccount.updatedAt * 1000);
      const windowTime = expiresAt.getTime() - updatedAt.getTime();
      const status = expiresAt > new Date() ? true : false;
      global2FA.status = status;
      global2FA.expiresAt = expiresAt;
      global2FA.windowTime = windowTime;
    }

    return {
      twoFA: {
        global: global2FA,
      },
      fetchGlobal2FA: refetchGlobal2FA,
    };
  }, [global2FAData, refetchGlobal2FA]);

  return (
    <ReentalDataContext.Provider value={value}>
      <Wrapper value={value}>{children}</Wrapper>
    </ReentalDataContext.Provider>
  );
};

export const useReentalDataContext = () => useContext(ReentalDataContext);
