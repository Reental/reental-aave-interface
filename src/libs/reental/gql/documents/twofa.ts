import { gql } from 'graphql-request';

export const GetTwoFaAccount = gql`
  query GetTwoFaAccount($chainId: Float!, $asset: String!, $user: String!) {
    twoFaAccount(asset: $asset, chainId: $chainId, user: $user) {
      chainId
      user
      asset
      expiresAt
    }
  }
`;
