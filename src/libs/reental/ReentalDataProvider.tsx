import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { maxUint160 } from 'viem';

import { useWeb3Context } from '../hooks/useWeb3Context';
import { request } from './gql/client';
import { GetTwoFaAccountDocument, GetTwoFaAccountQueryVariables } from './gql/types/graphql';

export interface ReentalDataProvider {
  twoFA: {
    global: {
      status: boolean;
      expiresAt: Date;
    };
    [asset: string]: {
      status: boolean;
      expiresAt: Date;
    };
  };
}

const ReentalDataContext = React.createContext<ReentalDataProvider>({} as ReentalDataProvider);

export const ReentalDataProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [global2FA, setGlobal2FA] = useState<ReentalDataProvider['twoFA']['global']>({
    status: false,
    expiresAt: new Date(),
  });
  const { chainId, currentAccount, provider } = useWeb3Context();

  // TODO: add per asset twoFA status

  const fetchGlobal2FA = useCallback(async () => {
    const defaultEveryTokenAddress = `0x${maxUint160.toString(16)}`;
    const variables: GetTwoFaAccountQueryVariables = {
      chainId,
      asset: defaultEveryTokenAddress,
      user: currentAccount,
    };
    const response = await request(GetTwoFaAccountDocument, variables);

    if (!response.twoFaAccount) {
      setGlobal2FA({
        status: false,
        expiresAt: new Date(),
      });
      return;
    }

    const expiresAt = new Date(response.twoFaAccount.expiresAt * 1000);
    const status = expiresAt > new Date() ? true : false;
    setGlobal2FA({
      status,
      expiresAt,
    });
  }, [currentAccount, chainId]);

  useEffect(() => {
    if (!provider) return;
    provider.on('block', fetchGlobal2FA);
    return () => {
      provider.removeAllListeners();
    };
  }, [provider, fetchGlobal2FA]);

  const value = useMemo(
    () => ({
      twoFA: {
        global: global2FA,
      },
    }),
    [global2FA]
  );

  return <ReentalDataContext.Provider value={value}>{children}</ReentalDataContext.Provider>;
};

export const useReentalDataContext = () => useContext(ReentalDataContext);
