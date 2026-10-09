/**
 * Queries against the liquidation-router indexer.
 *
 * Every one of these was executed against the live endpoint before being committed. Plural
 * fields return `{ items, totalCount, pageInfo }` — there is no `edges`/`node` wrapper.
 */

/**
 * The connected wallet's mandate, plus the router-level facts needed to render it.
 *
 * `lp` comes back null when the wallet has never registered, which is the signal to show
 * onboarding and nothing else. `orders` is empty for an *aggregating* LP too — that is not
 * the same thing, and the two must not be conflated: check `acceptsAllCollateral` first.
 */
export const MANDATE_QUERY = /* GraphQL */ `
  query Mandate($me: String!) {
    lp(address: $me) {
      address
      recipient
      enabled
      acceptsAllCollateral
      globalBudgetRemaining
      globalBudgetLastSet
      registeredAt
      orders {
        items {
          lpAddress
          collateralAsset
          budgetRemaining
          totalReceivedUsd
          totalReceivedUnits
          fillCount
          updatedAt
        }
      }
      debtCaps {
        items {
          lpAddress
          debtAsset
          maxDebtPerLiquidation
        }
      }
    }
    debtAssetListings {
      items {
        debtAsset
        aToken
      }
    }
    routerConfigs {
      items {
        address
        yieldPool
        liquidationPool
        whitelist
        manager
        deployedAtBlock
      }
    }
    tokenApprovals(where: { owner: $me, version: "v2", isActive: true }) {
      items {
        tokenAddress
        owner
        value
        isArming
        isStaleRisk
      }
    }
  }
`;

/** Earnings. `fromGlobalBudget` says which budget `collateralBudgetLeft` refers to. */
export const FILLS_QUERY = /* GraphQL */ `
  query Fills($me: String!, $limit: Int!) {
    fills(where: { lpAddress: $me }, orderBy: "timestamp", orderDirection: "desc", limit: $limit) {
      totalCount
      items {
        txHash
        logIndex
        lpAddress
        collateralAsset
        debtAsset
        debtContributed
        collateralReceived
        residualReturned
        collateralValueUsed
        collateralBudgetLeft
        fromGlobalBudget
        timestamp
      }
    }
  }
`;

/**
 * Why an LP earned nothing. Skipping is silent on-chain — the router passes an ineligible
 * candidate over rather than reverting — so this is the only place the reason surfaces.
 */
export const SKIPS_QUERY = /* GraphQL */ `
  query Skips($me: String!, $limit: Int!) {
    skips(
      where: { lpAddress: $me }
      orderBy: "blockNumber"
      orderDirection: "desc"
      limit: $limit
    ) {
      totalCount
      items {
        txHash
        lpAddress
        collateralAsset
        reason
        reasonName
        timestamp
      }
    }
  }
`;

/**
 * Who can fund a liquidation of one collateral asset.
 *
 * Two queries because the modes live in different tables. Aggregating LPs fund every
 * property and appear in `collateralOrders` for none of them, so dropping the second half
 * silently hides the LPs most likely to fill.
 */
export const FUNDERS_QUERY = /* GraphQL */ `
  query Funders($asset: String!, $limit: Int!) {
    collateralOrders(
      where: { collateralAsset: $asset, budgetRemaining_gt: "0" }
      orderBy: "budgetRemaining"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        lpAddress
        collateralAsset
        budgetRemaining
        lp {
          address
          recipient
          enabled
          acceptsAllCollateral
          globalBudgetRemaining
        }
      }
    }
    lps(
      where: { acceptsAllCollateral: true, enabled: true, globalBudgetRemaining_gt: "0" }
      limit: $limit
    ) {
      items {
        address
        recipient
        enabled
        acceptsAllCollateral
        globalBudgetRemaining
      }
    }
  }
`;

/** v1 rows are still indexed under the old per-LP routers, so the version filter matters. */
export const LIQUIDATIONS_QUERY = /* GraphQL */ `
  query Liquidations($limit: Int!) {
    liquidations(
      where: { version: "v2" }
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      totalCount
      items {
        id
        version
        borrower
        collateralAsset
        debtAsset
        debtCovered
        collateralSeized
        lpsUsed
        caller
        txHash
        timestamp
      }
    }
  }
`;

/** Backs a "data as of block N" badge, and doubles as the indexer-reachability probe. */
export const META_QUERY = /* GraphQL */ `
  query Meta {
    _meta {
      status
    }
  }
`;
