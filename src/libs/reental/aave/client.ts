// import { TypedQueryDocumentNode } from 'graphql';
import { GraphQLClient } from 'graphql-request';

const endpoints = {
  11155111:
    'https://api.goldsky.com/api/public/project_cmgziws0r00205np2estl7o0e/subgraphs/reental-aave-sepolia/v0.0.1/gn',
  137: 'https://api.goldsky.com/api/public/project_cmgziws0r00205np2estl7o0e/subgraphs/reental-aave-polygon/v0.0.1/gn',
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
