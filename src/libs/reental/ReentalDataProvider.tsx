import React, { PropsWithChildren, useContext, useMemo } from 'react';
import { TwoFACountdown } from 'src/components/Reental/TwoFACoundown/TwoFACountdown';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useWalletBalances } from 'src/hooks/app-data-provider/useWalletBalances';
import { useRootStore } from 'src/store/root';
import { selectIsMigrationAvailable } from 'src/store/v3MigrationSelectors';
import { maxUint160 } from 'viem';
import { useShallow } from 'zustand/shallow';

import { use2FA } from './2fa/services';
import { TwoFaAccount } from './gql/types/graphql';

const defaultState = {
  twoFA: {
    global: {
      status: false,
      expiresAt: new Date(),
      windowTime: 0,
    },
  },
  fetchGlobal2FA: () => Promise.resolve({}),
};

const Wrapper = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: typeof defaultState;
}) => {
  const currentMarketData = useRootStore((store) => store.currentMarketData);
  const { walletBalances } = useWalletBalances(currentMarketData);
  const { reserves, userReserves } = useAppDataContext();

  const userCollateralTokens = reserves.filter((reserve) => {
    const hasBalance = walletBalances[reserve.underlyingAsset]?.amount !== '0';
    const userReserve = userReserves.find(
      (userReserve) => userReserve.underlyingAsset === reserve.underlyingAsset
    );
    const hasReserve = userReserve ? userReserve.scaledATokenBalance !== '0' : false;
    const hasTokens = hasBalance || hasReserve;
    return hasTokens && reserve.usageAsCollateralEnabled;
  });

  const enable2FA = userCollateralTokens.length > 0;

  const { fetchGlobal2FA } = value;
  const { expiresAt, windowTime } = value.twoFA.global;

  return (
    <div>
      {enable2FA && (
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

const ReentalDataContext = React.createContext<typeof defaultState>(defaultState);

export const ReentalDataProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [, currentAccount, , currentMarketData] = useRootStore(
    useShallow((store) => [
      store.trackEvent,
      store.account,
      store.currentNetworkConfig,
      store.currentMarketData,
      store.currentMarket,
      selectIsMigrationAvailable(store),
    ])
  );

  const defaultEveryTokenAddress = `0x${maxUint160.toString(16)}`;

  const {
    data: global2FAData,
    refetch: refetchGlobal2FA,
    dataUpdatedAt,
  } = use2FA({
    chainId: currentMarketData.chainId,
    asset: defaultEveryTokenAddress,
    user: currentAccount,
  });

  const value = useMemo(() => {
    const onRefetch = (account?: TwoFaAccount | null) => {
      if (account) {
        const expiresAt = new Date(account.expiresAt * 1000);
        const updatedAt = new Date(account.updatedAt * 1000);
        const windowTime = expiresAt.getTime() - updatedAt.getTime();
        const status = expiresAt > new Date() ? true : false;
        return {
          status,
          expiresAt,
          windowTime,
        };
      }
      return defaultState.twoFA.global;
    };
    return {
      twoFA: {
        global: onRefetch(global2FAData?.twoFaAccount),
      },
      fetchGlobal2FA: refetchGlobal2FA,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUpdatedAt, global2FAData, refetchGlobal2FA]);

  return (
    <ReentalDataContext.Provider value={value}>
      <Wrapper value={value}>{children}</Wrapper>
    </ReentalDataContext.Provider>
  );
};

export const useReentalDataContext = () => useContext(ReentalDataContext);
