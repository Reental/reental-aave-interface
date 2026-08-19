/**
 * LpLiquidationRouterFactory — deploys one liquidation router per (user, asset).
 * Verified source: https://sepolia.etherscan.io/address/0x19b43022C2F42E7375b27A5F9E2442fe2cBA5d79
 */
export const LIQUIDATION_ROUTER_FACTORY_ABI = [
  'function deploySimpleRouter(address backstop_, address collateralRecipient_, address aToken_, address token_) returns (address router)',
  'function deployRouter(address backstop_, address recipientAdmin_, address collateralRecipient_, uint256 maxDebtPerLiquidation_, address aToken_, address token_) returns (address router)',
  'function routerCount() view returns (uint256)',
  'function routers(uint256) view returns (address)',
  'event RouterDeployed(address indexed router, address indexed backstop, address indexed recipientAdmin, address collateralRecipient, address aToken, address token)',
  'event SimpleRouterDeployed(address indexed router, address indexed backstop, address collateralRecipient, address aToken, address token)',
];

/** Views exposed by a deployed router, used for the info panel. */
export const LIQUIDATION_ROUTER_ABI = [
  'function backstop() view returns (address)',
  'function collateralRecipient() view returns (address)',
  'function aToken() view returns (address)',
  'function token() view returns (address)',
];
