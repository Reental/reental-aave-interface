/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  BigInt: { input: any; output: any };
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any };
};

export type Meta = {
  __typename?: 'Meta';
  status?: Maybe<Scalars['JSON']['output']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  _meta?: Maybe<Meta>;
  twoFaAccount?: Maybe<TwoFaAccount>;
  twoFaAccounts: TwoFaAccountPage;
};

export type QueryTwoFaAccountArgs = {
  asset: Scalars['String']['input'];
  chainId: Scalars['Float']['input'];
  user: Scalars['String']['input'];
};

export type QueryTwoFaAccountsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TwoFaAccountFilter>;
};

export type TwoFaAccount = {
  __typename?: 'twoFaAccount';
  asset: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  createdAt: Scalars['BigInt']['output'];
  expiresAt: Scalars['BigInt']['output'];
  updatedAt: Scalars['BigInt']['output'];
  user: Scalars['String']['output'];
};

export type TwoFaAccountFilter = {
  AND?: InputMaybe<Array<InputMaybe<TwoFaAccountFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<TwoFaAccountFilter>>>;
  asset?: InputMaybe<Scalars['String']['input']>;
  asset_contains?: InputMaybe<Scalars['String']['input']>;
  asset_ends_with?: InputMaybe<Scalars['String']['input']>;
  asset_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  asset_not?: InputMaybe<Scalars['String']['input']>;
  asset_not_contains?: InputMaybe<Scalars['String']['input']>;
  asset_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  asset_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  asset_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  asset_starts_with?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  expiresAt?: InputMaybe<Scalars['BigInt']['input']>;
  expiresAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  expiresAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  expiresAt_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  expiresAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  expiresAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  expiresAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  expiresAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type TwoFaAccountPage = {
  __typename?: 'twoFaAccountPage';
  items: Array<TwoFaAccount>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type GetTwoFaAccountQueryVariables = Exact<{
  chainId: Scalars['Float']['input'];
  asset: Scalars['String']['input'];
  user: Scalars['String']['input'];
}>;

export type GetTwoFaAccountQuery = {
  __typename?: 'Query';
  twoFaAccount?: {
    __typename?: 'twoFaAccount';
    chainId: number;
    user: string;
    asset: string;
    expiresAt: any;
    updatedAt: any;
    createdAt: any;
  } | null;
};

export const GetTwoFaAccountDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetTwoFaAccount' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'chainId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'asset' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'user' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'twoFaAccount' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'asset' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'asset' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'chainId' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'chainId' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'user' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'user' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'chainId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'user' } },
                { kind: 'Field', name: { kind: 'Name', value: 'asset' } },
                { kind: 'Field', name: { kind: 'Name', value: 'expiresAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTwoFaAccountQuery, GetTwoFaAccountQueryVariables>;
