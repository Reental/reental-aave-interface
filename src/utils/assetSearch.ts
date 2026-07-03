/**
 * Shared search matcher for asset lists.
 *
 * The search term is interpreted as a case-insensitive regular expression when
 * it is a valid one (e.g. "^usd", "eth|btc", "dai$"). If the term is not a
 * valid regex, it gracefully falls back to a plain case-insensitive substring
 * match, so typing characters like "(" mid-way never breaks the filter.
 */
export const matchesSearchTerm = (
  searchTerm: string,
  ...values: Array<string | undefined>
): boolean => {
  const term = searchTerm.trim();
  if (!term) return true;

  let regex: RegExp | undefined;
  try {
    regex = new RegExp(term, 'i');
  } catch {
    regex = undefined;
  }

  const lowerTerm = term.toLowerCase();

  return values.some((value) => {
    if (!value) return false;
    return regex ? regex.test(value) : value.toLowerCase().includes(lowerTerm);
  });
};
