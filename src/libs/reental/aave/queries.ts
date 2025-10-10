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

export type ReserveParamsHistoryItem = {
  reserve: {
    id: string;
    underlyingAsset: string;
  };
  liquidityRate: string;
  variableBorrowRate: string;
  timestamp: string;
};
