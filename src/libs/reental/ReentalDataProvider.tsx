import { Box } from '@mui/material';
import React, { PropsWithChildren, ReactNode, useContext, useEffect, useMemo, useRef } from 'react';
import { TwoFABanner } from 'src/components/Reental/TwoFABanner/TwoFABanner';
import { TwoFACountdown } from 'src/components/Reental/TwoFACoundown/TwoFACountdown';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useWalletBalances } from 'src/hooks/app-data-provider/useWalletBalances';
import { useRootStore } from 'src/store/root';
import { selectIsMigrationAvailable } from 'src/store/v3MigrationSelectors';
import { isFeatureEnabled } from 'src/utils/marketsAndNetworksConfig';
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
  loading: false,
  fetchGlobal2FA: () => Promise.resolve({}),
};

// Fakes an always-open 2FA time window for local development, e.g. when testing with a wallet
// that has no window opened on the Reental platform. Never enable it in a production build.
const BYPASS_2FA = process.env.NEXT_PUBLIC_BYPASS_2FA === 'true';
const BYPASSED_WINDOW_MS = 24 * 60 * 60 * 1000;

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
  const twoFARequired = !!isFeatureEnabled.twoFA(currentMarketData);

  const {
    data: global2FAData,
    refetch: refetchGlobal2FA,
    dataUpdatedAt,
    isLoading,
  } = use2FA({
    url: currentMarketData.reentalPonderUrl,
    chainId: currentMarketData.chainId,
    asset: defaultEveryTokenAddress,
    user: currentAccount,
    enabled: twoFARequired,
  });

  const value = useMemo(() => {
    if (BYPASS_2FA) {
      return {
        twoFA: {
          global: {
            status: true,
            expiresAt: new Date(Date.now() + BYPASSED_WINDOW_MS),
            windowTime: BYPASSED_WINDOW_MS,
          },
        },
        loading: false,
        fetchGlobal2FA: refetchGlobal2FA,
      };
    }

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
        // Markets outside the Reental backend (e.g. official Aave) don't gate on 2FA
        global: twoFARequired
          ? onRefetch(global2FAData?.twoFaAccount)
          : { ...defaultState.twoFA.global, status: true },
      },
      loading: twoFARequired && isLoading,
      fetchGlobal2FA: refetchGlobal2FA,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUpdatedAt, global2FAData, refetchGlobal2FA, twoFARequired, isLoading]);

  return <ReentalDataContext.Provider value={value}>{children}</ReentalDataContext.Provider>;
};

export const useReentalDataContext = () => useContext(ReentalDataContext);

/**
 * Gates the action area of a market page (dashboard lists, market assets, reserve actions) on
 * the Reental 2FA time window. While the window is open it shows the floating countdown; once it
 * expires only the wrapped section is blocked, so the market selector and stats stay usable.
 * App-wide pages like Bridge never render it.
 */
export const MarketTwoFAGate = ({ children }: { children: ReactNode }) => {
  const currentMarketData = useRootStore((store) => store.currentMarketData);
  const { walletBalances } = useWalletBalances(currentMarketData);
  const { reserves, userReserves } = useAppDataContext();
  const { twoFA, loading, fetchGlobal2FA } = useReentalDataContext();
  const contentRef = useRef<HTMLDivElement>(null);

  const hasCollateral = reserves.some((reserve) => {
    const hasBalance =
      walletBalances[reserve.underlyingAsset] &&
      walletBalances[reserve.underlyingAsset].amount !== '0';
    const userReserve = userReserves.find(
      (userReserve) => userReserve.underlyingAsset === reserve.underlyingAsset
    );
    const hasReserve = userReserve ? userReserve.scaledATokenBalance !== '0' : false;
    return (hasBalance || hasReserve) && reserve.usageAsCollateralEnabled;
  });

  const required = !!isFeatureEnabled.twoFA(currentMarketData) && hasCollateral;
  const windowOpen = twoFA.global.status;
  const blocked = required && !loading && !windowOpen;

  // `inert` keeps keyboard focus and screen readers out of the blocked section
  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;
    if (blocked) element.setAttribute('inert', '');
    else element.removeAttribute('inert');
  }, [blocked]);

  return (
    <Box sx={{ position: 'relative' }}>
      {required && windowOpen && (
        <TwoFACountdown
          windowTime={twoFA.global.windowTime}
          expirationDate={twoFA.global.expiresAt}
          fetchOnEnd={fetchGlobal2FA}
        />
      )}
      <Box
        ref={contentRef}
        sx={
          blocked
            ? // `isolate` keeps sticky headers inside (z-index 100) below the overlay
              { pointerEvents: 'none', userSelect: 'none', isolation: 'isolate' }
            : undefined
        }
      >
        {children}
      </Box>
      {blocked && <TwoFABanner />}
    </Box>
  );
};
