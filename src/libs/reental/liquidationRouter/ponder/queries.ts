/**
 * Queries against the liquidation-router indexer.
 *
 * `backstop` is the wallet that funds the debt and grants the arming allowance, so from
 * the connected user's point of view "my routers" means "routers I am the backstop of".
 */

const ROUTER_FIELDS = `
  address
  type
  backstop
  collateralRecipient
  recipientAdmin
  aToken
  token
  maxDebtPerLiquidation
  aTokenAllowance
  isArmed
  allowanceUpdatedAt
  pendingRecipient
  pendingRecipientEta
  liquidationCount
  totalDebtCovered
  totalCollateralSeized
  createdAtBlock
  createdAtTimestamp
  createdAtTxHash
  approvals(where: { isArming: true }) {
    items {
      value
      isActive
      isStaleRisk
      updatedAt
      token { address symbol decimals }
    }
  }
`;

/**
 * Every router the connected wallet backstops, unarmed ones included — arming them is
 * exactly what the dashboard card is for, so filtering on `isArmed` here would hide the
 * routers that most need attention. Arming state is surfaced per row instead.
 */
export const ROUTERS_BY_BACKSTOP = `
  query RoutersByBackstop($backstop: String!) {
    routers(
      where: { backstop: $backstop }
      orderBy: "createdAtBlock"
      orderDirection: "asc"
    ) {
      totalCount
      items { ${ROUTER_FIELDS} }
    }
  }
`;

/** Newest first; empty is the expected state until a liquidation actually happens. */
export const LIQUIDATIONS_BY_ROUTERS = `
  query LiquidationsByRouters($routers: [String!], $limit: Int!) {
    liquidations(
      where: { routerAddress_in: $routers }
      orderBy: "blockNumber"
      orderDirection: "desc"
      limit: $limit
    ) {
      totalCount
      pageInfo { hasNextPage endCursor }
      items {
        id
        routerAddress
        caller
        borrower
        collateralAsset
        debtCovered
        collateralSeized
        residual
        timestamp
        txHash
        router { address token }
      }
    }
  }
`;

export const SYNC_STATUS = `
  query SyncStatus {
    _meta { status }
  }
`;
