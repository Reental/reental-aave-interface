import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TwoFABanner } from 'src/components/Reental/TwoFABanner/TwoFABanner';
import { TwoFACountdown } from 'src/components/Reental/TwoFACoundown/TwoFACountdown';
import { useRootStore } from 'src/store/root';
import { selectIsMigrationAvailable } from 'src/store/v3MigrationSelectors';
import { maxUint160 } from 'viem';
import { useShallow } from 'zustand/shallow';

import { useWeb3Context } from '../hooks/useWeb3Context';
import { request } from './gql/client';
import { GetTwoFaAccountDocument, GetTwoFaAccountQueryVariables } from './gql/types/graphql';

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
  fetchGlobal2FA: () => Promise<void>;
}

const Wrapper = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ReentalDataProvider;
}) => {
  const { currentAccount } = useWeb3Context();
  const { fetchGlobal2FA } = value;
  const { status: isTwoFAEnabled, expiresAt, windowTime } = value.twoFA.global;
  return (
    <div>
      {currentAccount && !isTwoFAEnabled && <TwoFABanner />}
      {currentAccount && isTwoFAEnabled && expiresAt && (
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
  const [global2FA, setGlobal2FA] = useState<ReentalDataProvider['twoFA']['global']>({
    status: false,
    expiresAt: new Date(),
    windowTime: 0,
  });
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

  // TODO: add per asset twoFA status

  const fetchGlobal2FA = useCallback(async () => {
    const defaultEveryTokenAddress = `0x${maxUint160.toString(16)}`;
    const variables: GetTwoFaAccountQueryVariables = {
      chainId: currentMarketData.chainId,
      asset: defaultEveryTokenAddress,
      user: currentAccount,
    };
    const response = await request(GetTwoFaAccountDocument, variables);

    if (!response.twoFaAccount) {
      setGlobal2FA({
        status: false,
        expiresAt: new Date(),
        windowTime: 0,
      });
      return;
    }

    const expiresAt = new Date(response.twoFaAccount.expiresAt * 1000);
    const updatedAt = new Date(response.twoFaAccount.updatedAt * 1000);
    console.log(expiresAt, updatedAt);
    const windowTime = expiresAt.getTime() - updatedAt.getTime();
    const status = expiresAt > new Date() ? true : false;
    setGlobal2FA({
      status,
      expiresAt,
      windowTime,
    });
  }, [currentAccount, currentMarketData.chainId]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchGlobal2FA();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchGlobal2FA]);

  const value = useMemo(
    () => ({
      twoFA: {
        global: global2FA,
      },
      fetchGlobal2FA,
    }),
    [global2FA, fetchGlobal2FA]
  );

  return (
    <ReentalDataContext.Provider value={value}>
      <Wrapper value={value}>{children}</Wrapper>
    </ReentalDataContext.Provider>
  );
};

export const useReentalDataContext = () => useContext(ReentalDataContext);
