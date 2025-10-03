import { ProtocolAction } from '@aave/contract-helpers';
import { ReserveIncentiveResponse } from '@aave/math-utils/dist/esm/formatters/incentive/calculate-reserve-incentives';
// import {
//   AaveSafetyModule,
//   AaveV3Arbitrum,
//   AaveV3Avalanche,
//   AaveV3Base,
//   AaveV3Celo,
//   AaveV3Ethereum,
//   AaveV3EthereumLido,
//   AaveV3Gnosis,
//   AaveV3Sonic,
// } from '@bgd-labs/aave-address-book';
import { useQuery } from '@tanstack/react-query';
// import { CustomMarket } from 'src/ui-config/marketsConfig';
import { convertAprToApy } from 'src/utils/utils';

// Enable or disable Self incentives campaign
export const ENABLE_SELF_CAMPAIGN = true;
// export const ENABLE_SELF_CAMPAIGN = false;

export enum MeritAction {
  ETHEREUM_SGHO = 'ethereum-sgho',
  ETHEREUM_SUPPLY_PYUSD = 'ethereum-supply-pyusd',
  ETHEREUM_SUPPLY_ETHX = 'ethereum-supply-ethx',
  ETHEREUM_SUPPLY_RLUSD = 'ethereum-supply-rlusd',
  ETHEREUM_PRIME_SUPPLY_ETH = 'ethereum-prime-supply-weth',
  ETHEREUM_PRIME_SUPPLY_EZETH = 'ethereum-prime-supply-ezeth',
  SUPPLY_CBBTC_BORROW_USDC = 'ethereum-supply-cbbtc-borrow-usdc',
  SUPPLY_WBTC_BORROW_USDT = 'ethereum-supply-wbtc-borrow-usdt',
  SUPPLY_WEETH_BORROW_USDC = 'ethereum-supply-weeth-borrow-usdc',
  ETHEREUM_BORROW_EURC = 'ethereum-borrow-eurc',
  ARBITRUM_SUPPLY_ETH = 'arbitrum-supply-weth',
  ARBITRUM_SUPPLY_WSTETH = 'arbitrum-supply-wsteth',
  ARBITRUM_SUPPLY_EZETH = 'arbitrum-supply-ezeth',
  BASE_SUPPLY_CBBTC = 'base-supply-cbbtc',
  BASE_SUPPLY_USDC = 'base-supply-usdc',
  BASE_SUPPLY_WSTETH = 'base-supply-wsteth',
  BASE_SUPPLY_WEETH = 'base-supply-weeth',
  BASE_SUPPLY_EZETH = 'base-supply-ezeth',
  BASE_SUPPLY_EURC = 'base-supply-eurc',
  BASE_SUPPLY_GHO = 'base-supply-gho',
  BASE_SUPPLY_LBTC_BORROW_CBBTC = 'base-supply-lbtc-borrow-cbbtc',
  BASE_SUPPLY_CBBTC_BORROW_MULTIPLE = 'base-supply-cbbtc-borrow-multiple',
  BASE_SUPPLY_WSTETH_BORROW_MULTIPLE = 'base-supply-wsteth-borrow-multiple',
  BASE_SUPPLY_WETH_BORROW_MULTIPLE = 'base-supply-eth-borrow-multiple',
  BASE_BORROW_EURC = 'base-borrow-eurc',
  BASE_BORROW_USDC = 'base-borrow-usdc',
  BASE_BORROW_WSTETH = 'base-borrow-wsteth',
  BASE_BORROW_GHO = 'base-borrow-gho',
  AVALANCHE_SUPPLY_BTCB = 'avalanche-supply-btcb',
  AVALANCHE_SUPPLY_USDC = 'avalanche-supply-usdc',
  AVALANCHE_SUPPLY_USDT = 'avalanche-supply-usdt',
  AVALANCHE_SUPPLY_SAVAX = 'avalanche-supply-savax',
  AVALANCHE_SUPPLY_AUSD = 'avalanche-supply-ausd',
  AVALANCHE_SUPPLY_GHO = 'avalanche-supply-gho',
  AVALANCHE_BORROW_USDC = 'avalanche-borrow-usdc',
  AVALANCHE_BORROW_EURC = 'avalanche-borrow-eurc',
  SONIC_SUPPLY_USDCE = 'sonic-supply-usdce',
  SONIC_SUPPLY_STS_BORROW_WS = 'sonic-supply-sts-borrow-ws',
  GNOSIS_BORROW_EURE = 'gnosis-borrow-eure',
  CELO_SUPPLY_CELO = 'celo-supply-celo',
  CELO_SUPPLY_USDT = 'celo-supply-usdt',
  CELO_SUPPLY_USDC = 'celo-supply-usdc',
  CELO_SUPPLY_WETH = 'celo-supply-weth',
  CELO_SUPPLY_MULTIPLE_BORROW_USDT = 'celo-supply-multiple-borrow-usdt',
  CELO_BORROW_CELO = 'celo-borrow-celo',
  CELO_BORROW_USDT = 'celo-borrow-usdt',
  CELO_BORROW_USDC = 'celo-borrow-usdc',
  CELO_BORROW_WETH = 'celo-borrow-weth',
}

type MeritIncentives = {
  totalAPR: number;
  actionsAPR: {
    [key in MeritAction]: number | null | undefined;
  };
};

export type ExtendedReserveIncentiveResponse = ReserveIncentiveResponse & {
  action: MeritAction;
  customMessage: string;
  customForumLink: string;
};

export type MeritIncentivesBreakdown = {
  protocolAPY: number;
  protocolIncentivesAPR: number;
  meritIncentivesAPR: number; // Now represents APY (converted from APR)
  totalAPY: number;
  isBorrow: boolean;
  breakdown: {
    protocol: number;
    protocolIncentives: number;
    meritIncentives: number; // Now represents APY (converted from APR)
  };
};

const url = 'https://apps.aavechan.com/api/merit/aprs';

export type MeritReserveIncentiveData = Omit<ReserveIncentiveResponse, 'incentiveAPR'> & {
  action: MeritAction;
  customMessage?: string;
  customForumLink?: string;
  protocolAction?: ProtocolAction;
};

export const getMeritData = (
  market: string,
  symbol: string
): MeritReserveIncentiveData[] | undefined => MERIT_DATA_MAP[market]?.[symbol];

// const antiLoopMessage =
//   'Borrowing of some assets or holding of some token may impact the amount of rewards you are eligible for. Please check the forum post for the full eligibility criteria.';

// const antiLoopBorrowMessage =
//   'Supplying of some assets or holding of some token may impact the amount of rewards you are eligible for. Please check the forum post for the full eligibility criteria.';
// const masivBorrowUsdcMessage =
//   'Only new debt created since the campaign start will be rewarded. Supplying of some assets or holding of some token may impact the amount of rewards you are eligible for.';
// const lbtcCbbtcCampaignMessage =
//   'You must supply LBTC and borrow cbBTC, while maintaining a health factor of 1.5 or below, in order to receive merit rewards. Please check the forum post for the full eligibility criteria.';

// const StSLoopIncentiveProgramMessage =
//   'You must supply stS and borrow wS in order to receive merit rewards. stS/wS e-mode can be used to maximize stS/wS loop. Please check the forum post for the full eligibility criteria.';

// const weethUsdcCampaignMessage =
//   'You must supply weETH and borrow new USDC, while maintaining a health factor of 2 or below, in order to receive merit rewards. Eligibility criteria for this campaign are different from usual, please refer to the forum post for full details.';

// const baseIncentivesUSDCCampaignsMessage =
//   'Users must have Moonwell and Gauntlet Morpho Vault positions on Base and must migrate all their positions to Aave on Base to receive rewards. Holding some assets or positions on other protocols may impact the amount of rewards you are eligible for. Please check the forum post for the full eligibility criteria.';

// const baseIncentivesGHOCampaignsMessage =
//   'Users must have Moonwell and Gauntlet Morpho Vault positions on Base and must migrate all their positions to Aave on Base to receive rewards. Holding some assets or positions on other protocols may impact the amount of rewards you are eligible for. Please check the forum post for the full eligibility criteria.';
// const baseIncentivesCbbtcCampaignsMessage =
//   'You must supply cbBTC and borrow USDC, GHO, EURC or wETH to receive Merit rewards. Users must have Morpho positions on Base and/or Ethereum and must migrate all their positions to Aave on Base to receive rewards.  Please check the forum post for the full eligibility criteria.';

// const baseIncentivesWstETHCampaignsMessage =
//   'You must supply wstETH and borrow USDC, GHO, EURC or wETH to receive Merit rewards. Users must have Morpho positions on Base and must migrate all their positions to Aave on Base to receive rewards. Holding some assets or positions on other protocols may impact the amount of rewards you are eligible for. Please check the forum post for the full eligibility criteria.';

// const baseIncentivesETHCampaignsMessage =
//   'Supplying ETH alone earns 1.25%, supplying ETH and borrowing USDC or EURC earns 1.50%, supplying ETH and borrowing GHO earns 1.75%. Users must have Moonwell and Gauntlet Morpho Vault positions on Base and must migrate all their positions to Aave on Base to receive rewards. Holding some assets or positions on other protocols may impact the amount of rewards you are eligible for. Please check the forum post for the full eligibility criteria.';

// const celoSupplyMultipleBorrowUsdtMessage =
//   'You must supply (CELO or ETH) and borrow USDT, in order to receive merit rewards. Please check the forum post for the full eligibility criteria.';

// const joinedEthCorrelatedIncentiveForumLink =
//   'https://governance.aave.com/t/arfc-set-aci-as-emission-manager-for-liquidity-mining-programs/17898/56';

// // const joinedEthCorrelatedIncentivePhase2ForumLink =
// //   'https://governance.aave.com/t/arfc-set-aci-as-emission-manager-for-liquidity-mining-programs/17898/70';

// // const eurcForumLink =
// //   'https://governance.aave.com/t/arfc-set-aci-as-emission-manager-for-liquidity-mining-programs/17898/77';

// const AusdRenewalForumLink =
//   'https://governance.aave.com/t/arfc-set-aci-as-emission-manager-for-liquidity-mining-programs/17898/88';
// const AvalancheRenewalForumLink =
//   'https://governance.aave.com/t/arfc-set-aci-as-emission-manager-for-liquidity-mining-programs/17898/89';

// // const lbtcCbbtcForumLink =
// //   'https://governance.aave.com/t/arfc-set-aci-as-emission-manager-for-liquidity-mining-programs/17898/91';

// const weethUsdcForumLink =
//   'https://governance.aave.com/t/arfc-set-aci-as-emission-manager-for-liquidity-mining-programs/17898/120';

// const StSLoopIncentiveProgramForumLink =
//   'https://governance.aave.com/t/arfc-sts-loop-incentive-program/22368';

// const baseIncentivesForumLink =
//   'https://governance.aave.com/t/arfc-base-incentive-campaign-funding/21983';

export const MERIT_DATA_MAP: Record<string, Record<string, MeritReserveIncentiveData[]>> = {};
const getAprVariants = (action: MeritAction, actionsAPR: MeritIncentives['actionsAPR']) => {
  const map = actionsAPR as Record<string, number | null | undefined>;
  const selfAPR = map[`self-${action}`] ?? null;
  return { selfAPR };
};

export const useMeritIncentives = ({
  symbol,
  market,
  protocolAction,
  protocolAPY = 0,
  protocolIncentives = [],
}: {
  symbol: string;
  market: string;
  protocolAction?: ProtocolAction;
  protocolAPY?: number;
  protocolIncentives?: ReserveIncentiveResponse[];
}) => {
  return useQuery({
    queryFn: async () => {
      const response = await fetch(url);
      const data = await response.json();

      const meritIncentives = data.currentAPR as MeritIncentives;

      return meritIncentives;
    },
    queryKey: ['meritIncentives'],
    staleTime: 1000 * 60 * 5,
    select: (data) => {
      const meritReserveIncentiveData = getMeritData(market, symbol);

      if (!meritReserveIncentiveData) {
        return null;
      }

      const incentives = meritReserveIncentiveData.filter(
        (item) => item.protocolAction === protocolAction
      );

      if (incentives.length === 0) {
        return null;
      }

      let totalMeritAPR: number | null = null;
      let totalSelfAPR: number | null = null;
      const totalAmountIncentivesCampaigns: MeritAction[] = [];

      for (const incentive of incentives) {
        const standardAPR = data.actionsAPR[incentive.action];

        if (standardAPR !== null && standardAPR !== undefined && standardAPR > 0) {
          totalAmountIncentivesCampaigns.push(incentive.action);
        }
        if (standardAPR == null) continue;

        if (totalMeritAPR === null) totalMeritAPR = 0;
        totalMeritAPR += standardAPR;

        const variants = getAprVariants(incentive.action, data.actionsAPR);
        const selfAPR = ENABLE_SELF_CAMPAIGN ? variants.selfAPR : null;

        if (selfAPR != null) {
          if (totalSelfAPR === null) totalSelfAPR = 0;
          totalSelfAPR += selfAPR;
        }
      }

      if (totalMeritAPR === null) {
        return null;
      }

      const meritIncentivesAPY = convertAprToApy(totalMeritAPR / 100);

      const selfIncentivesAPY = totalSelfAPR != null ? convertAprToApy(totalSelfAPR / 100) : null;

      const protocolIncentivesAPR = protocolIncentives.reduce((sum, inc) => {
        return sum + (inc.incentiveAPR === 'Infinity' ? 0 : +inc.incentiveAPR);
      }, 0);

      const isBorrow = protocolAction === ProtocolAction.borrow;

      const totalAPY = isBorrow
        ? protocolAPY - protocolIncentivesAPR - meritIncentivesAPY - (selfIncentivesAPY ?? 0)
        : protocolAPY + protocolIncentivesAPR + meritIncentivesAPY + (selfIncentivesAPY ?? 0);

      let finalAction: MeritAction | undefined = undefined;
      if (totalAmountIncentivesCampaigns.length >= 1) {
        finalAction = totalAmountIncentivesCampaigns[0];
      }

      const actionMessages = incentives.reduce((acc, incentive) => {
        acc[incentive.action] = {
          customMessage: incentive.customMessage,
          customForumLink: incentive.customForumLink,
        };
        return acc;
      }, {} as Record<string, { customMessage?: string; customForumLink?: string }>);

      return {
        incentiveAPR: meritIncentivesAPY.toString(),
        rewardTokenAddress: incentives[0].rewardTokenAddress,
        rewardTokenSymbol: incentives[0].rewardTokenSymbol,
        activeActions: totalAmountIncentivesCampaigns,
        actionMessages: actionMessages,
        action: finalAction,
        customMessage: finalAction ? actionMessages[finalAction]?.customMessage : undefined,
        customForumLink: finalAction ? actionMessages[finalAction]?.customForumLink : undefined,
        variants: { selfAPY: selfIncentivesAPY },

        breakdown: {
          protocolAPY,
          protocolIncentivesAPR,
          meritIncentivesAPR: meritIncentivesAPY,
          totalAPY,
          isBorrow,
          breakdown: {
            protocol: protocolAPY,
            protocolIncentives: protocolIncentivesAPR,
            meritIncentives: meritIncentivesAPY,
          },
        } as MeritIncentivesBreakdown,
      } as ExtendedReserveIncentiveResponse & {
        breakdown: MeritIncentivesBreakdown;

        activeActions: MeritAction[];
        actionMessages: Record<string, { customMessage?: string; customForumLink?: string }>;
        variants: { selfAPY: number | null };
      };
    },
  });
};
