import { ChainId } from '@aave/contract-helpers';
import { AaveV3Ethereum } from '@bgd-labs/aave-address-book';
import { ReactNode } from 'react';

import { AaveV3Polygon, AaveV3Sepolia } from './custom';

// Enable for premissioned market
// import { PermissionView } from 'src/components/transactions/FlowCommons/PermissionView';
export type MarketDataType = {
  v3?: boolean;
  marketTitle: string;
  market: CustomMarket;
  // the network the market operates on
  chainId: ChainId;
  enabledFeatures?: {
    liquiditySwap?: boolean;
    staking?: boolean;
    governance?: boolean;
    faucet?: boolean;
    collateralRepay?: boolean;
    incentives?: boolean;
    permissions?: boolean;
    debtSwitch?: boolean;
    withdrawAndSwitch?: boolean;
    switch?: boolean;
    limit?: boolean;
    // Reental 2FA gating for collateral supply (only markets indexed by the Reental backend)
    twoFA?: boolean;
    // "Show metrics" history charts on the markets page (served by the Reental indexer)
    metrics?: boolean;
    // Shared liquidation router: needs addresses.SHARED_LIQUIDATION_ROUTER and liquidationsPonderUrl
    liquidations?: boolean;
  };
  permitDisabled?: boolean; // intended to be used for testnets
  // Reental pools run the pre-v3.1 UiPoolDataProvider, official Aave markets use the current one
  legacyUiPoolDataProvider?: boolean;
  // Reental ponder GraphQL endpoint (2FA time window), one deployment per network
  reentalPonderUrl?: string;
  // Liquidation-router ponder GraphQL endpoint, one deployment per network
  liquidationsPonderUrl?: string;
  isFork?: boolean;
  permissionComponent?: ReactNode;
  subgraphUrl?: string;
  logo?: string;
  // Icon shown for tokens without their own /icons/tokens/<symbol>.svg (defaults to DEFAULT_TOKEN_ICON)
  defaultTokenIcon?: string;
  externalUrl?: string; // URL for external markets like Aptos
  addresses: {
    LENDING_POOL_ADDRESS_PROVIDER: string;
    LENDING_POOL: string;
    WETH_GATEWAY?: string;
    SWAP_COLLATERAL_ADAPTER?: string;
    REPAY_WITH_COLLATERAL_ADAPTER?: string;
    DEBT_SWITCH_ADAPTER?: string;
    WITHDRAW_SWITCH_ADAPTER?: string;
    FAUCET?: string;
    PERMISSION_MANAGER?: string;
    WALLET_BALANCE_PROVIDER: string;
    L2_ENCODER?: string;
    UI_POOL_DATA_PROVIDER: string;
    UI_INCENTIVE_DATA_PROVIDER?: string;
    COLLECTOR?: string;
    V3_MIGRATOR?: string;
    GHO_TOKEN_ADDRESS?: string;
    GHO_UI_DATA_PROVIDER?: string;
    // Shared liquidation router. Every liquidity provider holds a *mandate* on this one
    // contract rather than owning a router of their own, so there is a single address per
    // market. The liquidity provider UI is hidden on markets where this is unset.
    SHARED_LIQUIDATION_ROUTER?: string;
  };
};
export enum CustomMarket {
  reental_polygon_v3 = 'reental_polygon_v3',
  reental_sepolia_v3 = 'reental_sepolia_v3',
  proto_mainnet_v3 = 'proto_mainnet_v3',
}
export const DEFAULT_TOKEN_ICON = '/icons/tokens/default.svg';
const REENTAL_DEFAULT_TOKEN_ICON = '/icons/tokens/reental.svg';

// const apiKey = process.env.NEXT_PUBLIC_SUBGRAPH_API_KEY;

export const marketsData: {
  [key in keyof typeof CustomMarket]: MarketDataType;
} = {
  [CustomMarket.reental_polygon_v3]: {
    marketTitle: 'Reental Polygon',
    market: CustomMarket.reental_polygon_v3,
    chainId: ChainId.polygon,
    logo: '/icons/markets/reental.png',
    defaultTokenIcon: REENTAL_DEFAULT_TOKEN_ICON,
    v3: true,
    legacyUiPoolDataProvider: true,
    reentalPonderUrl: 'https://ponder-pro.reental.eu/graphql',
    liquidationsPonderUrl: 'https://liquidation-router-ponder-pro.reental.eu/graphql',
    enabledFeatures: {
      liquiditySwap: false,
      incentives: true,
      collateralRepay: false,
      debtSwitch: false,
      withdrawAndSwitch: false,
      switch: false,
      twoFA: true,
      metrics: true,
      liquidations: true,
    },
    // subgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/Co2URyXjnxaw8WqxKyVHdirq9Ahhm5vcTs4dMedAq211`,
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: AaveV3Polygon.POOL_ADDRESSES_PROVIDER,
      LENDING_POOL: AaveV3Polygon.POOL,
      WETH_GATEWAY: AaveV3Polygon.WETH_GATEWAY,
      REPAY_WITH_COLLATERAL_ADAPTER: AaveV3Polygon.REPAY_WITH_COLLATERAL_ADAPTER,
      SWAP_COLLATERAL_ADAPTER: AaveV3Polygon.SWAP_COLLATERAL_ADAPTER,
      WALLET_BALANCE_PROVIDER: AaveV3Polygon.WALLET_BALANCE_PROVIDER,
      UI_POOL_DATA_PROVIDER: AaveV3Polygon.UI_POOL_DATA_PROVIDER,
      UI_INCENTIVE_DATA_PROVIDER: AaveV3Polygon.UI_INCENTIVE_DATA_PROVIDER,
      COLLECTOR: AaveV3Polygon.COLLECTOR,
      DEBT_SWITCH_ADAPTER: AaveV3Polygon.DEBT_SWAP_ADAPTER,
      WITHDRAW_SWITCH_ADAPTER: AaveV3Polygon.WITHDRAW_SWAP_ADAPTER,
      SHARED_LIQUIDATION_ROUTER: '0xae753596529d95DeC5ee39c20fad20865Abc5e90',
    },
  },
  [CustomMarket.reental_sepolia_v3]: {
    marketTitle: 'Reental Sepolia',
    market: CustomMarket.reental_sepolia_v3,
    v3: true,
    chainId: ChainId.sepolia,
    logo: '/icons/markets/reental.png',
    defaultTokenIcon: REENTAL_DEFAULT_TOKEN_ICON,
    legacyUiPoolDataProvider: true,
    reentalPonderUrl: 'https://ponder-int.reental.eu/graphql',
    liquidationsPonderUrl: 'https://liquidation-router-ponder-int.reental.eu/graphql',
    enabledFeatures: {
      faucet: true,
      twoFA: true,
      metrics: true,
      liquidations: true,
    },
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: AaveV3Sepolia.POOL_ADDRESSES_PROVIDER,
      LENDING_POOL: AaveV3Sepolia.POOL,
      WETH_GATEWAY: AaveV3Sepolia.WETH_GATEWAY,
      FAUCET: AaveV3Sepolia.FAUCET,
      WALLET_BALANCE_PROVIDER: AaveV3Sepolia.WALLET_BALANCE_PROVIDER,
      UI_POOL_DATA_PROVIDER: AaveV3Sepolia.UI_POOL_DATA_PROVIDER,
      UI_INCENTIVE_DATA_PROVIDER: AaveV3Sepolia.UI_INCENTIVE_DATA_PROVIDER,
      SHARED_LIQUIDATION_ROUTER: '0x694277431c449d58D32229D4EF827B0eA18228AD',
    },
  },
  // Official Aave V3 Core market on Ethereum
  [CustomMarket.proto_mainnet_v3]: {
    marketTitle: 'Aave Ethereum',
    market: CustomMarket.proto_mainnet_v3,
    chainId: ChainId.mainnet,
    logo: '/icons/tokens/aave.svg',
    v3: true,
    enabledFeatures: {
      incentives: true,
    },
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
      LENDING_POOL: AaveV3Ethereum.POOL,
      WETH_GATEWAY: AaveV3Ethereum.WETH_GATEWAY,
      REPAY_WITH_COLLATERAL_ADAPTER: AaveV3Ethereum.REPAY_WITH_COLLATERAL_ADAPTER,
      SWAP_COLLATERAL_ADAPTER: AaveV3Ethereum.SWAP_COLLATERAL_ADAPTER,
      WALLET_BALANCE_PROVIDER: AaveV3Ethereum.WALLET_BALANCE_PROVIDER,
      UI_POOL_DATA_PROVIDER: AaveV3Ethereum.UI_POOL_DATA_PROVIDER,
      UI_INCENTIVE_DATA_PROVIDER: AaveV3Ethereum.UI_INCENTIVE_DATA_PROVIDER,
      COLLECTOR: AaveV3Ethereum.COLLECTOR,
      GHO_TOKEN_ADDRESS: AaveV3Ethereum.ASSETS.GHO.UNDERLYING,
      WITHDRAW_SWITCH_ADAPTER: AaveV3Ethereum.WITHDRAW_SWAP_ADAPTER,
      DEBT_SWITCH_ADAPTER: AaveV3Ethereum.DEBT_SWAP_ADAPTER,
    },
  },
} as const;

export const findByChainId = (chainId: ChainId) => {
  return Object.values(marketsData).find((market) => market.chainId === chainId);
};
