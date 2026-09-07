/**
 * Reental real estate tokens are listed with a "Reental-<PROPERTY>" symbol, but some of the
 * on-chain ERC20s were deployed with a differently cased prefix (e.g. "REENTAL-CAR-1").
 * These helpers normalize the prefix so the UI always renders it as "Reental-", no matter
 * how the token contract spells it.
 */
export const REENTAL_SYMBOL_PREFIX = 'Reental-';

// matches "reental" followed by a separator (-, _ or spaces) at the start of a symbol
const REENTAL_PREFIX_REGEX = /^reental[-_\s]+/i;

export const isReentalSymbol = (symbol: string) => REENTAL_PREFIX_REGEX.test(symbol);

/**
 * "REENTAL-CAR-1" | "reental_car-1" -> "Reental-CAR-1". Non Reental symbols are left as is.
 */
export const normalizeReentalSymbol = (symbol: string) =>
  isReentalSymbol(symbol) ? symbol.replace(REENTAL_PREFIX_REGEX, REENTAL_SYMBOL_PREFIX) : symbol;

/**
 * "REENTAL-CAR-1" -> "CAR-1". Non Reental symbols are left as is.
 */
export const stripReentalPrefix = (symbol: string) => symbol.replace(REENTAL_PREFIX_REGEX, '');
