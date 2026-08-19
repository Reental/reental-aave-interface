/**
 * Read-only client for the liquidation-router Ponder indexer.
 *
 * Separate from `src/libs/reental/gql/client.ts`, which talks to the 2FA Ponder instance
 * at a different URL. Kept as a plain fetch rather than graphql-request so a network
 * failure stays distinguishable from a GraphQL error — the UI has to tell "indexer
 * offline" apart from "no routers", and an empty list for a down indexer is a lie.
 */

export const PONDER_LIQUIDATIONS_URL =
  process.env.NEXT_PUBLIC_PONDER_LIQUIDATIONS_URL ?? 'http://localhost:42069/graphql';

/** The indexer could not be reached at all, as opposed to answering with an error. */
export class PonderOfflineError extends Error {
  readonly reason: unknown;

  constructor(reason: unknown) {
    super('Liquidation indexer is unreachable');
    this.name = 'PonderOfflineError';
    this.reason = reason;
    // Required so `instanceof` survives the ES5 downlevel of extending a built-in.
    Object.setPrototypeOf(this, PonderOfflineError.prototype);
  }
}

export const isPonderOffline = (error: unknown) => error instanceof PonderOfflineError;

export const ponderQuery = async <T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> => {
  let response: Response;

  try {
    response = await fetch(PONDER_LIQUIDATIONS_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
  } catch (error) {
    // Connection refused / DNS failure / CORS block: the indexer is not answering.
    throw new PonderOfflineError(error);
  }

  // 5xx from a reverse proxy in front of a dead indexer is the same situation.
  if (response.status >= 500) {
    throw new PonderOfflineError(new Error(`Ponder ${response.status}`));
  }

  if (!response.ok) {
    throw new Error(`Ponder ${response.status}: ${await response.text()}`);
  }

  const body = await response.json();

  if (body.errors?.length) {
    throw new Error(body.errors.map((error: { message: string }) => error.message).join('; '));
  }

  return body.data as T;
};
