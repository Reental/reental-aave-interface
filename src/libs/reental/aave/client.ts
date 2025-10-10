// import { TypedQueryDocumentNode } from 'graphql';
import { GraphQLClient } from 'graphql-request';

const endpoints = {
  11155111:
    'https://subgraph.satsuma-prod.com/c18b322af44b/reental--3960108/reental-aave-sepolia/api',
  137: 'https://subgraph.satsuma-prod.com/c18b322af44b/reental--3960108/reental-aave-polygon/api',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const request = async <T = any, S = any>(
  chainId: number,
  query: string,
  variables: S & { [key: string]: unknown }
): Promise<T> => {
  try {
    const client = new GraphQLClient(endpoints[chainId as keyof typeof endpoints], {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await client.request<T>(query, variables);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
