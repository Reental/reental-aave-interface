/**
 * SharedLiquidationRouter — one router for every liquidity provider.
 *
 * An LP no longer owns a router; it holds a *mandate* on this single contract. Nothing in
 * the UI is keyed by a router address any more, only by the LP's own wallet.
 *
 * Every fragment below is verified present in the deployed bytecode at
 * https://sepolia.etherscan.io/address/0x694277431c449d58D32229D4EF827B0eA18228AD
 */
export const SHARED_LIQUIDATION_ROUTER_ABI = [
  /**
   * The whole mandate in one call: registers on the first call, updates on every later one.
   * There is no separate update entry point — onboarding and editing are the same call.
   *
   * Selector 0xe9190fd8. It supersedes the register/setRecipient/setAcceptAllCollateral/
   * setCollateralBudget/setMaxDebtPerLiquidation sequence below rather than replacing it:
   * those still exist, and the granular mandate screens still use them.
   *
   * Conventions carry over unchanged — budgets are 8-decimal USD, maxDebts are in each debt
   * asset's own decimals, and the two array pairs are matched index-wise. The collateral
   * arrays are read only when acceptAll is false.
   */
  'function configure((address recipient, bool acceptAll, uint256 globalBudgetUsd, address[] debtAssets, uint256[] maxDebts, address[] collateralAssets, uint256[] collateralBudgetsUsd) cfg)',

  // --- mandate lifecycle, in the order the contract enforces ---
  // register() must come first: every other setter reverts with "SLR: not registered".
  'function register(address recipient_)',
  'function setRecipient(address recipient_)',
  'function setEnabled(bool enabled_)',

  // Enumerated mode: one budget per collateral asset, 8-decimal USD. 0 means "not accepted".
  'function setCollateralBudget(address collateralAsset_, uint256 amountUsd_)',
  // Mode switch. Flipping acceptAll to true makes one pooled budget fund every RWA, including
  // ones listed later. Per-asset budgets survive the switch but go dormant.
  'function setAcceptAllCollateral(bool acceptAll_, uint256 amountUsd_)',
  // Tops the pooled budget up WITHOUT touching the mode. Not interchangeable with the call
  // above: using setAcceptAllCollateral as a top-up silently flips an enumerated LP into
  // accepting every property.
  'function setGlobalCollateralBudget(uint256 amountUsd_)',

  // maxDebt is in the debt asset's own decimals. Reverts with "SLR: unsupported debt asset"
  // before the registration check, so only listed debt assets may be passed here.
  //
  // A cap of 0 means the LP funds NOTHING — it is not a sentinel for "uncapped". Verified on
  // a Sepolia fork: an LP passing every other gate quoted 0 until a cap was set, at which
  // point quote() returned the cap clamped by the remaining ceilings. Use UNLIMITED_MAX_DEBT
  // to express "no ceiling".
  'function setMaxDebtPerLiquidation(address debtAsset_, uint256 maxDebt_)',

  // --- liquidation ---
  'function liquidate(address borrower, address collateralAsset, address debtAsset, uint256 debtToCover, address[] candidates)',
  'function quote(address[] candidates, address collateralAsset, address debtAsset) view returns (uint256[] maxDebt, uint256[] collateralOut, uint256 collateralPerDebt)',

  // --- reads ---
  // Four return values under v2: the fourth is the collateral mode.
  'function mandateOf(address lp) view returns (address recipient, bool registered, bool enabled, bool acceptsAllCollateral)',
  // Resolves pooled-vs-per-asset exactly as the router does when filling. isGlobal tells you
  // which of the two budgets the figure came from.
  'function effectiveBudget(address lp, address collateralAsset) view returns (uint256 budgetUsd, bool isGlobal)',
  'function globalCollateralBudget(address lp) view returns (uint256)',
  'function collateralBudget(address lp, address collateralAsset) view returns (uint256)',
  'function remainingBudget(address lp, address collateralAsset) view returns (uint256)',
  'function maxDebtPerLiquidation(address lp, address debtAsset) view returns (uint256)',
  'function aTokenOf(address debtAsset) view returns (address)',
  'function getLps() view returns (address[])',
  'function getDebtAssets() view returns (address[])',
  'function whitelist() view returns (address)',
  'function MAX_CANDIDATES() view returns (uint256)',

  // --- events ---
  'event Registered(address indexed lp, address indexed recipient)',
  'event RecipientChanged(address indexed lp, address indexed oldRecipient, address indexed newRecipient)',
  'event EnabledSet(address indexed lp, bool enabled)',
  'event CollateralBudgetSet(address indexed lp, address indexed collateralAsset, uint256 amount, uint256 previous)',
  'event AcceptAllCollateralSet(address indexed lp, bool acceptAll, uint256 amountUsd)',
  'event GlobalCollateralBudgetSet(address indexed lp, uint256 amount, uint256 previous)',
  'event MaxDebtPerLiquidationSet(address indexed lp, address indexed debtAsset, uint256 maxDebt)',
  'event LpParticipated(address indexed lp, address indexed collateralAsset, address indexed debtAsset, uint256 debtContributed, uint256 collateralReceived, uint256 residualReturned)',
  'event LpSkipped(address indexed lp, address indexed collateralAsset, uint8 reason)',
  'event Liquidated(address indexed borrower, address indexed collateralAsset, address indexed debtAsset, uint256 debtCovered, uint256 collateralSeized, uint256 lpsUsed)',
];

/**
 * The `LpConfig` struct `configure` takes, in the struct's own field order.
 *
 * Amounts stay strings all the way to the encoder: a pooled budget of 1e36 and an uncapped
 * maxDebt of max uint are both well past Number's safe range.
 */
export type LpConfig = {
  /** Where this LP receives seized RWA, and the address the whitelist is checked against. */
  recipient: string;
  /** true = one pooled budget funds every property, including ones listed later. */
  acceptAll: boolean;
  /** Pooled budget, 8-decimal USD. Read only when acceptAll is true. */
  globalBudgetUsd: string;
  /** Paired index-wise with maxDebts. */
  debtAssets: string[];
  /** Per-liquidation cap, in the debt asset's own decimals. 0 funds nothing — see UNLIMITED_MAX_DEBT. */
  maxDebts: string[];
  /** Paired index-wise with collateralBudgetsUsd. Read only when acceptAll is false. */
  collateralAssets: string[];
  /** Per-property budget, 8-decimal USD. */
  collateralBudgetsUsd: string[];
};

/**
 * The whitelist the router points to via `whitelist()`.
 *
 * Always ask the contract rather than rebuilding the global-vs-linked-list branch in
 * TypeScript — reconstructing that logic is a known source of wrong answers.
 */
export const LIQUIDATION_WHITELIST_ABI = [
  'function isWhitelisted(address collateralAsset, address account) view returns (bool)',
];

/**
 * Reental's RWA tokens gate every transfer on their own control contract, which is separate
 * from the router's whitelist and is NOT modelled by `quote()`. Collateral moves through the
 * router on its way to the recipient, so the router itself has to be permitted to hold the
 * token — a liquidation reverts otherwise even when the router quotes a healthy number.
 */
export const REENTAL_TOKEN_ABI = ['function tokenControl() view returns (address)'];

/** Reverts with ReentalTokenControl_NotWhitelisted when the transfer is not permitted. */
export const REENTAL_TOKEN_CONTROL_ABI = [
  'function checkTransfer(address token, address from, address to, uint256 amount) view',
];

/** Enough of ERC20 to read the two aToken ceilings the indexer cannot give us. */
export const ATOKEN_ABI = [
  'function allowance(address owner, address spender) view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
];

/** Collateral budgets are denominated in USD with 8 decimals, not in token decimals. */
export const BUDGET_USD_DECIMALS = 8;

/**
 * "No per-liquidation ceiling", expressed as max uint.
 *
 * There is no zero-means-unlimited sentinel: zero is a real cap of zero. The other three
 * ceilings still clamp this, so it grants no more than the LP's allowance, deposit balance
 * and collateral budget already allow.
 */
export const UNLIMITED_MAX_DEBT =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';

/**
 * Anything at or above this is treated on-chain as unconstrained, so it must be rendered
 * as "Unlimited" rather than as a 37-digit number.
 */
export const UNCONSTRAINED_THRESHOLD = BigInt('1000000000000000000000000000000000000'); // 1e36

/**
 * Why the router passed an LP over. Mirrors the uint8 in LpSkipped; the indexer also
 * exposes it as `reasonName`, which is what we key on.
 */
export type SkipReason =
  | 'NotRegistered'
  | 'Disabled'
  | 'NoCollateralBudget'
  | 'RecipientNotWhitelisted'
  | 'NoCapacity';
