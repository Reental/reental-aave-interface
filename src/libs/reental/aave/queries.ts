// const data: {
//   __typename: "APYSample";
//   avgRate: {
//       __typename: "PercentValue";
//       raw: BigIntString;
//       decimals: number;
//       value: BigDecimal;
//       formatted: BigDecimal;
//   };
//   date: DateTime;
// }[] | undefined

export const GetTokenHistoryValues = `
  query GetTokenHistoryValues(
    $asset: String!
    $startDate: Int!
    $endDate: Int!
    $first: Int!
    $skip: Int!
    $orderBy: ReserveParamsHistoryItem_orderBy!
    $orderDirection: OrderDirection!
  ) {
    reserveParamsHistoryItems(
      where: { reserve_contains: $asset, timestamp_gte: $startDate, timestamp_lte: $endDate }
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      reserve {
        id
        underlyingAsset
        decimals
      }
      liquidityRate
      variableBorrowRate
      timestamp
    }
  }
`;

export const GetMarketHistoryValues = `
  query GetMarketHistoryValues(
    $underlyingAssets: [Bytes!]!
    $startDate: Int!
    $endDate: Int!
    $first: Int!
    $skip: Int!
    $orderBy: ReserveParamsHistoryItem_orderBy!
    $orderDirection: OrderDirection!
  ) {
    reserveParamsHistoryItems(
      where: {
        reserve_: { underlyingAsset_in: $underlyingAssets }
        timestamp_gte: $startDate
        timestamp_lte: $endDate
      }
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      reserve {
        id
        underlyingAsset
        decimals
      }
      totalLiquidity
      availableLiquidity
      priceInUsd
      timestamp
    }
  }
`;

export type ReserveParamsHistoryItem = {
  reserve: {
    id: string;
    underlyingAsset: string;
  };
  liquidityRate: string;
  variableBorrowRate: string;
  timestamp: string;
};

export type MarketReserveParamsHistoryItem = {
  reserve: {
    id: string;
    underlyingAsset: string;
    decimals: number;
  };
  totalLiquidity: string;
  availableLiquidity: string;
  priceInUsd: string;
  timestamp: number;
};
