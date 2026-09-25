/**
 * Minimal GraphQL client for the liquidation-router Ponder indexer.
 *
 * Deliberately not the shared `gql/client.ts`: that one is pinned to the 2FA indexer and
 * swallows failures into a console log. Here the difference between "the indexer is down"
 * and "the indexer is up and there is nothing yet" has to survive all the way to the UI —
 * zero LPs is the expected state on a fresh deployment, and rendering that as an error
 * would be wrong.
 */

export const PONDER_URL = process.env.NEXT_PUBLIC_PONDER_LIQUIDATIONS_URL;

/** Thrown when the indexer could not be reached or answered with errors. */
export class PonderUnavailableError extends Error {
  readonly reason: string;

  constructor(reason: string) {
    super(`Liquidation indexer unavailable: ${reason}`);
    this.name = 'PonderUnavailableError';
    this.reason = reason;
    // Restores `instanceof` under the ES5 downlevel this project compiles to.
    Object.setPrototypeOf(this, PonderUnavailableError.prototype);
  }
}

export const ponderRequest = async <T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> => {
  if (!PONDER_URL) {
    throw new PonderUnavailableError('NEXT_PUBLIC_PONDER_LIQUIDATIONS_URL is not set');
  }

  let response: Response;
  try {
    response = await fetch(PONDER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
  } catch (error) {
    throw new PonderUnavailableError(error instanceof Error ? error.message : 'network error');
  }

  if (!response.ok) {
    throw new PonderUnavailableError(`HTTP ${response.status}`);
  }

  const body = (await response.json()) as { data?: T; errors?: Array<{ message: string }> };

  // A schema drift shows up here rather than as a missing field downstream, which is the
  // only place it can be reported honestly.
  if (body.errors?.length) {
    throw new PonderUnavailableError(body.errors.map((error) => error.message).join('; '));
  }
  if (!body.data) {
    throw new PonderUnavailableError('empty response');
  }

  return body.data;
};

/** The indexer lowercases every address it returns, so wallet comparisons need this. */
export const sameAddress = (a?: string, b?: string) =>
  !!a && !!b && a.toLowerCase() === b.toLowerCase();
