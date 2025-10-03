// import { TypedQueryDocumentNode } from 'graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { GraphQLClient } from 'graphql-request';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const request = async <T = any, S = any>(
  query: DocumentNode<T, S>,
  variables: S & { [key: string]: unknown }
): Promise<T> => {
  try {
    const client = new GraphQLClient(process.env.REENTAL_PONDER_URL as string, {
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
