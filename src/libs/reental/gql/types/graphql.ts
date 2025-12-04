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
  account?: Maybe<Account>;
  accounts: AccountPage;
  assetOracleConfig?: Maybe<AssetOracleConfig>;
  assetOracleConfigs: AssetOracleConfigPage;
  balance?: Maybe<Balance>;
  balances: BalancePage;
  distribution?: Maybe<Distribution>;
  distributions: DistributionPage;
  dividendAccount?: Maybe<DividendAccount>;
  dividendAccounts: DividendAccountPage;
  dividendClaim?: Maybe<DividendClaim>;
  dividendClaims: DividendClaimPage;
  dividendContract?: Maybe<DividendContract>;
  dividendContracts: DividendContractPage;
  erc20?: Maybe<Erc20>;
  erc20s: Erc20Page;
  ev?: Maybe<Ev>;
  evs: EvPage;
  investment?: Maybe<Investment>;
  investments: InvestmentPage;
  rntBalance?: Maybe<RntBalance>;
  rntBalances: RntBalancePage;
  rntToken?: Maybe<RntToken>;
  rntTokens: RntTokenPage;
  rntTransfer?: Maybe<RntTransfer>;
  rntTransfers: RntTransferPage;
  termination?: Maybe<Termination>;
  terminations: TerminationPage;
  terminatorClaim?: Maybe<TerminatorClaim>;
  terminatorClaims: TerminatorClaimPage;
  terminatorContract?: Maybe<TerminatorContract>;
  terminatorContracts: TerminatorContractPage;
  token?: Maybe<Token>;
  tokenFactory?: Maybe<TokenFactory>;
  tokenFactorys: TokenFactoryPage;
  tokenTransfer?: Maybe<TokenTransfer>;
  tokenTransfers: TokenTransferPage;
  tokens: TokenPage;
  twoFaAccount?: Maybe<TwoFaAccount>;
  twoFaAccounts: TwoFaAccountPage;
  vault?: Maybe<Vault>;
  vaultBalance?: Maybe<VaultBalance>;
  vaultBalances: VaultBalancePage;
  vaults: VaultPage;
  wallet?: Maybe<Wallet>;
  walletWhitelistRegistry?: Maybe<WalletWhitelistRegistry>;
  walletWhitelistRegistrys: WalletWhitelistRegistryPage;
  wallets: WalletPage;
  webhookError?: Maybe<WebhookError>;
  webhookErrors: WebhookErrorPage;
  whitelist?: Maybe<Whitelist>;
  whitelistContract?: Maybe<WhitelistContract>;
  whitelistContracts: WhitelistContractPage;
  whitelistTokenRegistry?: Maybe<WhitelistTokenRegistry>;
  whitelistTokenRegistrys: WhitelistTokenRegistryPage;
  whitelists: WhitelistPage;
  xRntTransfer?: Maybe<XRntTransfer>;
  xRntTransfers: XRntTransferPage;
};

export type QueryAccountArgs = {
  address: Scalars['String']['input'];
  chainId: Scalars['Float']['input'];
};

export type QueryAccountsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<AccountFilter>;
};

export type QueryAssetOracleConfigArgs = {
  assetAddress: Scalars['String']['input'];
  chainId: Scalars['Float']['input'];
};

export type QueryAssetOracleConfigsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<AssetOracleConfigFilter>;
};

export type QueryBalanceArgs = {
  chainId: Scalars['Float']['input'];
  tokenAddress: Scalars['String']['input'];
  walletAddress: Scalars['String']['input'];
};

export type QueryBalancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<BalanceFilter>;
};

export type QueryDistributionArgs = {
  address: Scalars['String']['input'];
  chainId: Scalars['Float']['input'];
  id: Scalars['String']['input'];
};

export type QueryDistributionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DistributionFilter>;
};

export type QueryDividendAccountArgs = {
  address: Scalars['String']['input'];
  chainId: Scalars['Float']['input'];
  distributionId: Scalars['String']['input'];
  walletAddress: Scalars['String']['input'];
};

export type QueryDividendAccountsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DividendAccountFilter>;
};

export type QueryDividendClaimArgs = {
  chainId: Scalars['Float']['input'];
  logIndex: Scalars['Float']['input'];
  transactionHash: Scalars['String']['input'];
};

export type QueryDividendClaimsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DividendClaimFilter>;
};

export type QueryDividendContractArgs = {
  address: Scalars['String']['input'];
  chainId: Scalars['Float']['input'];
};

export type QueryDividendContractsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DividendContractFilter>;
};

export type QueryErc20Args = {
  address: Scalars['String']['input'];
  chainId: Scalars['Float']['input'];
};

export type QueryErc20sArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Erc20Filter>;
};

export type QueryEvArgs = {
  chainId: Scalars['Float']['input'];
  logIndex: Scalars['Float']['input'];
  transactionHash: Scalars['String']['input'];
};

export type QueryEvsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<EvFilter>;
};

export type QueryInvestmentArgs = {
  chainId: Scalars['Float']['input'];
  logIndex: Scalars['Float']['input'];
  transactionHash: Scalars['String']['input'];
};

export type QueryInvestmentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<InvestmentFilter>;
};

export type QueryRntBalanceArgs = {
  chainId: Scalars['Float']['input'];
  tokenAddress: Scalars['String']['input'];
  walletAddress: Scalars['String']['input'];
};

export type QueryRntBalancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<RntBalanceFilter>;
};

export type QueryRntTokenArgs = {
  address: Scalars['String']['input'];
  chainId: Scalars['Float']['input'];
};

export type QueryRntTokensArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<RntTokenFilter>;
};

export type QueryRntTransferArgs = {
  address: Scalars['String']['input'];
  chainId: Scalars['Float']['input'];
  logIndex: Scalars['Float']['input'];
  transactionHash: Scalars['String']['input'];
};

export type QueryRntTransfersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<RntTransferFilter>;
};

export type QueryTerminationArgs = {
  address: Scalars['String']['input'];
  chainId: Scalars['Float']['input'];
  tokenAddress: Scalars['String']['input'];
};

export type QueryTerminationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TerminationFilter>;
};

export type QueryTerminatorClaimArgs = {
  chainId: Scalars['Float']['input'];
  logIndex: Scalars['Float']['input'];
  transactionHash: Scalars['String']['input'];
};

export type QueryTerminatorClaimsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TerminatorClaimFilter>;
};

export type QueryTerminatorContractArgs = {
  address: Scalars['String']['input'];
  chainId: Scalars['Float']['input'];
};

export type QueryTerminatorContractsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TerminatorContractFilter>;
};

export type QueryTokenArgs = {
  address: Scalars['String']['input'];
  chainId: Scalars['Float']['input'];
};

export type QueryTokenFactoryArgs = {
  address: Scalars['String']['input'];
  chainId: Scalars['Float']['input'];
};

export type QueryTokenFactorysArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TokenFactoryFilter>;
};

export type QueryTokenTransferArgs = {
  chainId: Scalars['Float']['input'];
  logIndex: Scalars['Float']['input'];
  transactionHash: Scalars['String']['input'];
};

export type QueryTokenTransfersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TokenTransferFilter>;
};

export type QueryTokensArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TokenFilter>;
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
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TwoFaAccountFilter>;
};

export type QueryVaultArgs = {
  address: Scalars['String']['input'];
  chainId: Scalars['Float']['input'];
};

export type QueryVaultBalanceArgs = {
  chainId: Scalars['Float']['input'];
  ownerAddress: Scalars['String']['input'];
  tokenAddress: Scalars['String']['input'];
};

export type QueryVaultBalancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<VaultBalanceFilter>;
};

export type QueryVaultsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<VaultFilter>;
};

export type QueryWalletArgs = {
  address: Scalars['String']['input'];
};

export type QueryWalletWhitelistRegistryArgs = {
  address: Scalars['String']['input'];
  chainId: Scalars['Float']['input'];
  hashId: Scalars['String']['input'];
  whitelistAddress: Scalars['String']['input'];
};

export type QueryWalletWhitelistRegistrysArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<WalletWhitelistRegistryFilter>;
};

export type QueryWalletsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<WalletFilter>;
};

export type QueryWebhookErrorArgs = {
  chainId: Scalars['Float']['input'];
  logIndex: Scalars['Float']['input'];
  transactionHash: Scalars['String']['input'];
};

export type QueryWebhookErrorsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<WebhookErrorFilter>;
};

export type QueryWhitelistArgs = {
  address: Scalars['String']['input'];
  chainId: Scalars['Float']['input'];
  hashId: Scalars['String']['input'];
};

export type QueryWhitelistContractArgs = {
  address: Scalars['String']['input'];
  chainId: Scalars['Float']['input'];
};

export type QueryWhitelistContractsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<WhitelistContractFilter>;
};

export type QueryWhitelistTokenRegistryArgs = {
  address: Scalars['String']['input'];
  chainId: Scalars['Float']['input'];
  tokenAddress: Scalars['String']['input'];
};

export type QueryWhitelistTokenRegistrysArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<WhitelistTokenRegistryFilter>;
};

export type QueryWhitelistsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<WhitelistFilter>;
};

export type QueryXRntTransferArgs = {
  address: Scalars['String']['input'];
  chainId: Scalars['Float']['input'];
  logIndex: Scalars['Float']['input'];
  transactionHash: Scalars['String']['input'];
};

export type QueryXRntTransfersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<XRntTransferFilter>;
};

export type ViewPageInfo = {
  __typename?: 'ViewPageInfo';
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
};

export type Account = {
  __typename?: 'account';
  address: Scalars['String']['output'];
  balances?: Maybe<BalancePage>;
  chainId: Scalars['Int']['output'];
  createdAt: Scalars['BigInt']['output'];
  dividendClaims?: Maybe<DividendClaimPage>;
  rntBalances?: Maybe<RntBalancePage>;
  terminatorClaims?: Maybe<TerminatorClaimPage>;
  vault?: Maybe<Vault>;
  wallet?: Maybe<Wallet>;
  walletRegistries?: Maybe<WalletWhitelistRegistryPage>;
};

export type AccountBalancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<BalanceFilter>;
};

export type AccountDividendClaimsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DividendClaimFilter>;
};

export type AccountRntBalancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<RntBalanceFilter>;
};

export type AccountTerminatorClaimsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TerminatorClaimFilter>;
};

export type AccountWalletRegistriesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<WalletWhitelistRegistryFilter>;
};

export type AccountFilter = {
  AND?: InputMaybe<Array<InputMaybe<AccountFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<AccountFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
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
};

export type AccountPage = {
  __typename?: 'accountPage';
  items: Array<Account>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AssetOracleConfig = {
  __typename?: 'assetOracleConfig';
  aggregator: Scalars['String']['output'];
  asset: Scalars['JSON']['output'];
  assetAddress: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  createdAt: Scalars['BigInt']['output'];
  decimals: Scalars['Int']['output'];
  description: Scalars['String']['output'];
  oracle: Scalars['String']['output'];
  paymentToken: Scalars['JSON']['output'];
  paymentTokenOracle: Scalars['String']['output'];
  updatedAt: Scalars['BigInt']['output'];
};

export type AssetOracleConfigFilter = {
  AND?: InputMaybe<Array<InputMaybe<AssetOracleConfigFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<AssetOracleConfigFilter>>>;
  aggregator?: InputMaybe<Scalars['String']['input']>;
  aggregator_contains?: InputMaybe<Scalars['String']['input']>;
  aggregator_ends_with?: InputMaybe<Scalars['String']['input']>;
  aggregator_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  aggregator_not?: InputMaybe<Scalars['String']['input']>;
  aggregator_not_contains?: InputMaybe<Scalars['String']['input']>;
  aggregator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  aggregator_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  aggregator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  aggregator_starts_with?: InputMaybe<Scalars['String']['input']>;
  assetAddress?: InputMaybe<Scalars['String']['input']>;
  assetAddress_contains?: InputMaybe<Scalars['String']['input']>;
  assetAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  assetAddress_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  assetAddress_not?: InputMaybe<Scalars['String']['input']>;
  assetAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  assetAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  assetAddress_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  assetAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  assetAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
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
  decimals?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_contains?: InputMaybe<Scalars['String']['input']>;
  description_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  description_not?: InputMaybe<Scalars['String']['input']>;
  description_not_contains?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  description_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_starts_with?: InputMaybe<Scalars['String']['input']>;
  oracle?: InputMaybe<Scalars['String']['input']>;
  oracle_contains?: InputMaybe<Scalars['String']['input']>;
  oracle_ends_with?: InputMaybe<Scalars['String']['input']>;
  oracle_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  oracle_not?: InputMaybe<Scalars['String']['input']>;
  oracle_not_contains?: InputMaybe<Scalars['String']['input']>;
  oracle_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  oracle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  oracle_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  oracle_starts_with?: InputMaybe<Scalars['String']['input']>;
  paymentTokenOracle?: InputMaybe<Scalars['String']['input']>;
  paymentTokenOracle_contains?: InputMaybe<Scalars['String']['input']>;
  paymentTokenOracle_ends_with?: InputMaybe<Scalars['String']['input']>;
  paymentTokenOracle_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  paymentTokenOracle_not?: InputMaybe<Scalars['String']['input']>;
  paymentTokenOracle_not_contains?: InputMaybe<Scalars['String']['input']>;
  paymentTokenOracle_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  paymentTokenOracle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  paymentTokenOracle_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  paymentTokenOracle_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
};

export type AssetOracleConfigPage = {
  __typename?: 'assetOracleConfigPage';
  items: Array<AssetOracleConfig>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type Balance = {
  __typename?: 'balance';
  account?: Maybe<Account>;
  amount: Scalars['BigInt']['output'];
  chainId: Scalars['Int']['output'];
  createdAt: Scalars['BigInt']['output'];
  token?: Maybe<Token>;
  tokenAddress: Scalars['String']['output'];
  updatedAt: Scalars['BigInt']['output'];
  wallet?: Maybe<Wallet>;
  walletAddress: Scalars['String']['output'];
};

export type BalanceFilter = {
  AND?: InputMaybe<Array<InputMaybe<BalanceFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<BalanceFilter>>>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
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
  tokenAddress?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_contains?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tokenAddress_not?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tokenAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  walletAddress?: InputMaybe<Scalars['String']['input']>;
  walletAddress_contains?: InputMaybe<Scalars['String']['input']>;
  walletAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  walletAddress_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  walletAddress_not?: InputMaybe<Scalars['String']['input']>;
  walletAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  walletAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  walletAddress_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  walletAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  walletAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type BalancePage = {
  __typename?: 'balancePage';
  items: Array<Balance>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type Distribution = {
  __typename?: 'distribution';
  accounts?: Maybe<DividendAccountPage>;
  address: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  claims?: Maybe<DividendClaimPage>;
  contract?: Maybe<DividendContract>;
  createdAt: Scalars['BigInt']['output'];
  id: Scalars['String']['output'];
  merkleRoot: Scalars['String']['output'];
  updatedAt: Scalars['BigInt']['output'];
  uri: Scalars['String']['output'];
};

export type DistributionAccountsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DividendAccountFilter>;
};

export type DistributionClaimsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DividendClaimFilter>;
};

export type DistributionFilter = {
  AND?: InputMaybe<Array<InputMaybe<DistributionFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<DistributionFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
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
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  merkleRoot?: InputMaybe<Scalars['String']['input']>;
  merkleRoot_contains?: InputMaybe<Scalars['String']['input']>;
  merkleRoot_ends_with?: InputMaybe<Scalars['String']['input']>;
  merkleRoot_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  merkleRoot_not?: InputMaybe<Scalars['String']['input']>;
  merkleRoot_not_contains?: InputMaybe<Scalars['String']['input']>;
  merkleRoot_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  merkleRoot_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  merkleRoot_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  merkleRoot_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  uri?: InputMaybe<Scalars['String']['input']>;
  uri_contains?: InputMaybe<Scalars['String']['input']>;
  uri_ends_with?: InputMaybe<Scalars['String']['input']>;
  uri_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  uri_not?: InputMaybe<Scalars['String']['input']>;
  uri_not_contains?: InputMaybe<Scalars['String']['input']>;
  uri_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  uri_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  uri_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  uri_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type DistributionPage = {
  __typename?: 'distributionPage';
  items: Array<Distribution>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DividendAccount = {
  __typename?: 'dividendAccount';
  address: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  claimed: Scalars['BigInt']['output'];
  createdAt: Scalars['BigInt']['output'];
  distribution?: Maybe<Distribution>;
  distributionId: Scalars['String']['output'];
  reinvested: Scalars['BigInt']['output'];
  retained: Scalars['BigInt']['output'];
  updatedAt: Scalars['BigInt']['output'];
  walletAddress: Scalars['String']['output'];
};

export type DividendAccountFilter = {
  AND?: InputMaybe<Array<InputMaybe<DividendAccountFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<DividendAccountFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  claimed?: InputMaybe<Scalars['BigInt']['input']>;
  claimed_gt?: InputMaybe<Scalars['BigInt']['input']>;
  claimed_gte?: InputMaybe<Scalars['BigInt']['input']>;
  claimed_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  claimed_lt?: InputMaybe<Scalars['BigInt']['input']>;
  claimed_lte?: InputMaybe<Scalars['BigInt']['input']>;
  claimed_not?: InputMaybe<Scalars['BigInt']['input']>;
  claimed_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  distributionId?: InputMaybe<Scalars['String']['input']>;
  distributionId_contains?: InputMaybe<Scalars['String']['input']>;
  distributionId_ends_with?: InputMaybe<Scalars['String']['input']>;
  distributionId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  distributionId_not?: InputMaybe<Scalars['String']['input']>;
  distributionId_not_contains?: InputMaybe<Scalars['String']['input']>;
  distributionId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  distributionId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  distributionId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  distributionId_starts_with?: InputMaybe<Scalars['String']['input']>;
  reinvested?: InputMaybe<Scalars['BigInt']['input']>;
  reinvested_gt?: InputMaybe<Scalars['BigInt']['input']>;
  reinvested_gte?: InputMaybe<Scalars['BigInt']['input']>;
  reinvested_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  reinvested_lt?: InputMaybe<Scalars['BigInt']['input']>;
  reinvested_lte?: InputMaybe<Scalars['BigInt']['input']>;
  reinvested_not?: InputMaybe<Scalars['BigInt']['input']>;
  reinvested_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  retained?: InputMaybe<Scalars['BigInt']['input']>;
  retained_gt?: InputMaybe<Scalars['BigInt']['input']>;
  retained_gte?: InputMaybe<Scalars['BigInt']['input']>;
  retained_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  retained_lt?: InputMaybe<Scalars['BigInt']['input']>;
  retained_lte?: InputMaybe<Scalars['BigInt']['input']>;
  retained_not?: InputMaybe<Scalars['BigInt']['input']>;
  retained_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  walletAddress?: InputMaybe<Scalars['String']['input']>;
  walletAddress_contains?: InputMaybe<Scalars['String']['input']>;
  walletAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  walletAddress_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  walletAddress_not?: InputMaybe<Scalars['String']['input']>;
  walletAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  walletAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  walletAddress_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  walletAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  walletAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type DividendAccountPage = {
  __typename?: 'dividendAccountPage';
  items: Array<DividendAccount>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DividendClaim = {
  __typename?: 'dividendClaim';
  account?: Maybe<Account>;
  address: Scalars['String']['output'];
  amount: Scalars['BigInt']['output'];
  blockNumber: Scalars['BigInt']['output'];
  chainId: Scalars['Int']['output'];
  claimToken: Scalars['JSON']['output'];
  distribution?: Maybe<Distribution>;
  distributionId: Scalars['String']['output'];
  dividendAccount?: Maybe<DividendAccount>;
  logIndex: Scalars['Int']['output'];
  reinvested: Scalars['Boolean']['output'];
  retention: Scalars['BigInt']['output'];
  timestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['String']['output'];
  wallet?: Maybe<Wallet>;
  walletAddress: Scalars['String']['output'];
};

export type DividendClaimFilter = {
  AND?: InputMaybe<Array<InputMaybe<DividendClaimFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<DividendClaimFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  distributionId?: InputMaybe<Scalars['String']['input']>;
  distributionId_contains?: InputMaybe<Scalars['String']['input']>;
  distributionId_ends_with?: InputMaybe<Scalars['String']['input']>;
  distributionId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  distributionId_not?: InputMaybe<Scalars['String']['input']>;
  distributionId_not_contains?: InputMaybe<Scalars['String']['input']>;
  distributionId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  distributionId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  distributionId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  distributionId_starts_with?: InputMaybe<Scalars['String']['input']>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  reinvested?: InputMaybe<Scalars['Boolean']['input']>;
  reinvested_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  reinvested_not?: InputMaybe<Scalars['Boolean']['input']>;
  reinvested_not_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  retention?: InputMaybe<Scalars['BigInt']['input']>;
  retention_gt?: InputMaybe<Scalars['BigInt']['input']>;
  retention_gte?: InputMaybe<Scalars['BigInt']['input']>;
  retention_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  retention_lt?: InputMaybe<Scalars['BigInt']['input']>;
  retention_lte?: InputMaybe<Scalars['BigInt']['input']>;
  retention_not?: InputMaybe<Scalars['BigInt']['input']>;
  retention_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  walletAddress?: InputMaybe<Scalars['String']['input']>;
  walletAddress_contains?: InputMaybe<Scalars['String']['input']>;
  walletAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  walletAddress_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  walletAddress_not?: InputMaybe<Scalars['String']['input']>;
  walletAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  walletAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  walletAddress_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  walletAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  walletAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type DividendClaimPage = {
  __typename?: 'dividendClaimPage';
  items: Array<DividendClaim>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DividendContract = {
  __typename?: 'dividendContract';
  address: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  createdAt: Scalars['BigInt']['output'];
  distributions?: Maybe<DistributionPage>;
  token: Scalars['JSON']['output'];
  updatedAt: Scalars['BigInt']['output'];
};

export type DividendContractDistributionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DistributionFilter>;
};

export type DividendContractFilter = {
  AND?: InputMaybe<Array<InputMaybe<DividendContractFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<DividendContractFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
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
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
};

export type DividendContractPage = {
  __typename?: 'dividendContractPage';
  items: Array<DividendContract>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type Erc20 = {
  __typename?: 'erc20';
  address: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  decimals: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
};

export type Erc20Filter = {
  AND?: InputMaybe<Array<InputMaybe<Erc20Filter>>>;
  OR?: InputMaybe<Array<InputMaybe<Erc20Filter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  decimals?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type Erc20Page = {
  __typename?: 'erc20Page';
  items: Array<Erc20>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type Ev = {
  __typename?: 'ev';
  address: Scalars['String']['output'];
  args: Scalars['JSON']['output'];
  blockNumber: Scalars['BigInt']['output'];
  chainId: Scalars['Int']['output'];
  contractAddress: Scalars['String']['output'];
  event: Scalars['String']['output'];
  logIndex: Scalars['Int']['output'];
  network: Scalars['JSON']['output'];
  nonce: Scalars['BigInt']['output'];
  ponderEvent: Scalars['String']['output'];
  result?: Maybe<Scalars['JSON']['output']>;
  timestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['String']['output'];
  txFrom: Scalars['String']['output'];
  txHash: Scalars['String']['output'];
  txIndex: Scalars['Int']['output'];
  txTo?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
};

export type EvFilter = {
  AND?: InputMaybe<Array<InputMaybe<EvFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<EvFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  contractAddress?: InputMaybe<Scalars['String']['input']>;
  contractAddress_contains?: InputMaybe<Scalars['String']['input']>;
  contractAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  contractAddress_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  contractAddress_not?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  contractAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  contractAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  event?: InputMaybe<Scalars['String']['input']>;
  event_contains?: InputMaybe<Scalars['String']['input']>;
  event_ends_with?: InputMaybe<Scalars['String']['input']>;
  event_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  event_not?: InputMaybe<Scalars['String']['input']>;
  event_not_contains?: InputMaybe<Scalars['String']['input']>;
  event_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  event_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  event_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  event_starts_with?: InputMaybe<Scalars['String']['input']>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  nonce?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_gt?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_gte?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  nonce_lt?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_lte?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_not?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  ponderEvent?: InputMaybe<Scalars['String']['input']>;
  ponderEvent_contains?: InputMaybe<Scalars['String']['input']>;
  ponderEvent_ends_with?: InputMaybe<Scalars['String']['input']>;
  ponderEvent_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ponderEvent_not?: InputMaybe<Scalars['String']['input']>;
  ponderEvent_not_contains?: InputMaybe<Scalars['String']['input']>;
  ponderEvent_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  ponderEvent_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ponderEvent_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  ponderEvent_starts_with?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  txFrom?: InputMaybe<Scalars['String']['input']>;
  txFrom_contains?: InputMaybe<Scalars['String']['input']>;
  txFrom_ends_with?: InputMaybe<Scalars['String']['input']>;
  txFrom_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  txFrom_not?: InputMaybe<Scalars['String']['input']>;
  txFrom_not_contains?: InputMaybe<Scalars['String']['input']>;
  txFrom_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  txFrom_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  txFrom_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  txFrom_starts_with?: InputMaybe<Scalars['String']['input']>;
  txHash?: InputMaybe<Scalars['String']['input']>;
  txHash_contains?: InputMaybe<Scalars['String']['input']>;
  txHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  txHash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  txHash_not?: InputMaybe<Scalars['String']['input']>;
  txHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  txHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  txHash_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  txHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  txHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  txIndex?: InputMaybe<Scalars['Int']['input']>;
  txIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  txIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  txIndex_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  txIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  txIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  txIndex_not?: InputMaybe<Scalars['Int']['input']>;
  txIndex_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  txTo?: InputMaybe<Scalars['String']['input']>;
  txTo_contains?: InputMaybe<Scalars['String']['input']>;
  txTo_ends_with?: InputMaybe<Scalars['String']['input']>;
  txTo_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  txTo_not?: InputMaybe<Scalars['String']['input']>;
  txTo_not_contains?: InputMaybe<Scalars['String']['input']>;
  txTo_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  txTo_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  txTo_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  txTo_starts_with?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_contains?: InputMaybe<Scalars['String']['input']>;
  type_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  type_not?: InputMaybe<Scalars['String']['input']>;
  type_not_contains?: InputMaybe<Scalars['String']['input']>;
  type_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  type_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  type_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type EvPage = {
  __typename?: 'evPage';
  items: Array<Ev>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type Investment = {
  __typename?: 'investment';
  address: Scalars['String']['output'];
  asset: Scalars['JSON']['output'];
  assetPrice: Scalars['BigInt']['output'];
  assetPriceDecimals: Scalars['Int']['output'];
  assetsOut: Scalars['BigInt']['output'];
  blockNumber: Scalars['BigInt']['output'];
  chainId: Scalars['Int']['output'];
  createdAt: Scalars['BigInt']['output'];
  discount: Scalars['BigInt']['output'];
  logIndex: Scalars['Int']['output'];
  payer: Scalars['String']['output'];
  paymentIn: Scalars['BigInt']['output'];
  paymentToken: Scalars['JSON']['output'];
  receiver: Scalars['String']['output'];
  tier: Tier;
  timestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['String']['output'];
  updatedAt: Scalars['BigInt']['output'];
};

export type InvestmentFilter = {
  AND?: InputMaybe<Array<InputMaybe<InvestmentFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<InvestmentFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  assetPrice?: InputMaybe<Scalars['BigInt']['input']>;
  assetPriceDecimals?: InputMaybe<Scalars['Int']['input']>;
  assetPriceDecimals_gt?: InputMaybe<Scalars['Int']['input']>;
  assetPriceDecimals_gte?: InputMaybe<Scalars['Int']['input']>;
  assetPriceDecimals_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  assetPriceDecimals_lt?: InputMaybe<Scalars['Int']['input']>;
  assetPriceDecimals_lte?: InputMaybe<Scalars['Int']['input']>;
  assetPriceDecimals_not?: InputMaybe<Scalars['Int']['input']>;
  assetPriceDecimals_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  assetPrice_gt?: InputMaybe<Scalars['BigInt']['input']>;
  assetPrice_gte?: InputMaybe<Scalars['BigInt']['input']>;
  assetPrice_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  assetPrice_lt?: InputMaybe<Scalars['BigInt']['input']>;
  assetPrice_lte?: InputMaybe<Scalars['BigInt']['input']>;
  assetPrice_not?: InputMaybe<Scalars['BigInt']['input']>;
  assetPrice_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  assetsOut?: InputMaybe<Scalars['BigInt']['input']>;
  assetsOut_gt?: InputMaybe<Scalars['BigInt']['input']>;
  assetsOut_gte?: InputMaybe<Scalars['BigInt']['input']>;
  assetsOut_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  assetsOut_lt?: InputMaybe<Scalars['BigInt']['input']>;
  assetsOut_lte?: InputMaybe<Scalars['BigInt']['input']>;
  assetsOut_not?: InputMaybe<Scalars['BigInt']['input']>;
  assetsOut_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
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
  discount?: InputMaybe<Scalars['BigInt']['input']>;
  discount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  discount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  discount_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  discount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  discount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  discount_not?: InputMaybe<Scalars['BigInt']['input']>;
  discount_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  payer?: InputMaybe<Scalars['String']['input']>;
  payer_contains?: InputMaybe<Scalars['String']['input']>;
  payer_ends_with?: InputMaybe<Scalars['String']['input']>;
  payer_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  payer_not?: InputMaybe<Scalars['String']['input']>;
  payer_not_contains?: InputMaybe<Scalars['String']['input']>;
  payer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  payer_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  payer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  payer_starts_with?: InputMaybe<Scalars['String']['input']>;
  paymentIn?: InputMaybe<Scalars['BigInt']['input']>;
  paymentIn_gt?: InputMaybe<Scalars['BigInt']['input']>;
  paymentIn_gte?: InputMaybe<Scalars['BigInt']['input']>;
  paymentIn_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  paymentIn_lt?: InputMaybe<Scalars['BigInt']['input']>;
  paymentIn_lte?: InputMaybe<Scalars['BigInt']['input']>;
  paymentIn_not?: InputMaybe<Scalars['BigInt']['input']>;
  paymentIn_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  receiver?: InputMaybe<Scalars['String']['input']>;
  receiver_contains?: InputMaybe<Scalars['String']['input']>;
  receiver_ends_with?: InputMaybe<Scalars['String']['input']>;
  receiver_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  receiver_not?: InputMaybe<Scalars['String']['input']>;
  receiver_not_contains?: InputMaybe<Scalars['String']['input']>;
  receiver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  receiver_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  receiver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  receiver_starts_with?: InputMaybe<Scalars['String']['input']>;
  tier?: InputMaybe<Tier>;
  tier_in?: InputMaybe<Array<InputMaybe<Tier>>>;
  tier_not?: InputMaybe<Tier>;
  tier_not_in?: InputMaybe<Array<InputMaybe<Tier>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
};

export type InvestmentPage = {
  __typename?: 'investmentPage';
  items: Array<Investment>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type RntBalance = {
  __typename?: 'rntBalance';
  account?: Maybe<Account>;
  amount: Scalars['BigInt']['output'];
  chainId: Scalars['Int']['output'];
  createdAt: Scalars['BigInt']['output'];
  token?: Maybe<RntToken>;
  tokenAddress: Scalars['String']['output'];
  updatedAt: Scalars['BigInt']['output'];
  wallet?: Maybe<Wallet>;
  walletAddress: Scalars['String']['output'];
};

export type RntBalanceFilter = {
  AND?: InputMaybe<Array<InputMaybe<RntBalanceFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<RntBalanceFilter>>>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
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
  tokenAddress?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_contains?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tokenAddress_not?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tokenAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  walletAddress?: InputMaybe<Scalars['String']['input']>;
  walletAddress_contains?: InputMaybe<Scalars['String']['input']>;
  walletAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  walletAddress_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  walletAddress_not?: InputMaybe<Scalars['String']['input']>;
  walletAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  walletAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  walletAddress_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  walletAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  walletAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type RntBalancePage = {
  __typename?: 'rntBalancePage';
  items: Array<RntBalance>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type RntToken = {
  __typename?: 'rntToken';
  address: Scalars['String']['output'];
  balances?: Maybe<RntBalancePage>;
  chainId: Scalars['Int']['output'];
  createdAt: Scalars['BigInt']['output'];
  decimals: Scalars['Int']['output'];
  maxSupply: Scalars['BigInt']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  totalSupply: Scalars['BigInt']['output'];
  transfers?: Maybe<RntTransferPage>;
  updatedAt: Scalars['BigInt']['output'];
};

export type RntTokenBalancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<RntBalanceFilter>;
};

export type RntTokenTransfersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<RntTransferFilter>;
};

export type RntTokenFilter = {
  AND?: InputMaybe<Array<InputMaybe<RntTokenFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<RntTokenFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
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
  decimals?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  maxSupply?: InputMaybe<Scalars['BigInt']['input']>;
  maxSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  maxSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  maxSupply_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  maxSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  maxSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  maxSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  maxSupply_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  totalSupply?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
};

export type RntTokenPage = {
  __typename?: 'rntTokenPage';
  items: Array<RntToken>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type RntTransfer = {
  __typename?: 'rntTransfer';
  address: Scalars['String']['output'];
  amount: Scalars['BigInt']['output'];
  blockNumber: Scalars['BigInt']['output'];
  chainId: Scalars['Int']['output'];
  event?: Maybe<Ev>;
  from: Scalars['String']['output'];
  logIndex: Scalars['Int']['output'];
  timestamp: Scalars['BigInt']['output'];
  to: Scalars['String']['output'];
  token?: Maybe<RntToken>;
  transactionHash: Scalars['String']['output'];
};

export type RntTransferFilter = {
  AND?: InputMaybe<Array<InputMaybe<RntTransferFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<RntTransferFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  from?: InputMaybe<Scalars['String']['input']>;
  from_contains?: InputMaybe<Scalars['String']['input']>;
  from_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  from_not?: InputMaybe<Scalars['String']['input']>;
  from_not_contains?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  from_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_starts_with?: InputMaybe<Scalars['String']['input']>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  to?: InputMaybe<Scalars['String']['input']>;
  to_contains?: InputMaybe<Scalars['String']['input']>;
  to_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  to_not?: InputMaybe<Scalars['String']['input']>;
  to_not_contains?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  to_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type RntTransferPage = {
  __typename?: 'rntTransferPage';
  items: Array<RntTransfer>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type Termination = {
  __typename?: 'termination';
  address: Scalars['String']['output'];
  amount: Scalars['BigInt']['output'];
  chainId: Scalars['Int']['output'];
  createdAt: Scalars['BigInt']['output'];
  terminatorContract?: Maybe<TerminatorContract>;
  token?: Maybe<Token>;
  tokenAddress: Scalars['String']['output'];
  updatedAt: Scalars['BigInt']['output'];
};

export type TerminationFilter = {
  AND?: InputMaybe<Array<InputMaybe<TerminationFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<TerminationFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
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
  tokenAddress?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_contains?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tokenAddress_not?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tokenAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
};

export type TerminationPage = {
  __typename?: 'terminationPage';
  items: Array<Termination>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type TerminatorClaim = {
  __typename?: 'terminatorClaim';
  account?: Maybe<Account>;
  address: Scalars['String']['output'];
  amountBonus: Scalars['BigInt']['output'];
  amountIn: Scalars['BigInt']['output'];
  amountOut: Scalars['BigInt']['output'];
  blockNumber: Scalars['BigInt']['output'];
  chainId: Scalars['Int']['output'];
  logIndex: Scalars['Int']['output'];
  reinvested: Scalars['Boolean']['output'];
  termination?: Maybe<Termination>;
  terminatorToken: Scalars['JSON']['output'];
  timestamp: Scalars['BigInt']['output'];
  to: Scalars['String']['output'];
  token?: Maybe<Token>;
  tokenAddress: Scalars['String']['output'];
  transactionHash: Scalars['String']['output'];
  wallet?: Maybe<Wallet>;
  walletAddress: Scalars['String']['output'];
};

export type TerminatorClaimFilter = {
  AND?: InputMaybe<Array<InputMaybe<TerminatorClaimFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<TerminatorClaimFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  amountBonus?: InputMaybe<Scalars['BigInt']['input']>;
  amountBonus_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amountBonus_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amountBonus_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  amountBonus_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amountBonus_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amountBonus_not?: InputMaybe<Scalars['BigInt']['input']>;
  amountBonus_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  amountIn?: InputMaybe<Scalars['BigInt']['input']>;
  amountIn_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amountIn_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amountIn_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  amountIn_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amountIn_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amountIn_not?: InputMaybe<Scalars['BigInt']['input']>;
  amountIn_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  amountOut?: InputMaybe<Scalars['BigInt']['input']>;
  amountOut_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amountOut_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amountOut_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  amountOut_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amountOut_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amountOut_not?: InputMaybe<Scalars['BigInt']['input']>;
  amountOut_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  reinvested?: InputMaybe<Scalars['Boolean']['input']>;
  reinvested_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  reinvested_not?: InputMaybe<Scalars['Boolean']['input']>;
  reinvested_not_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  to?: InputMaybe<Scalars['String']['input']>;
  to_contains?: InputMaybe<Scalars['String']['input']>;
  to_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  to_not?: InputMaybe<Scalars['String']['input']>;
  to_not_contains?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  to_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_contains?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tokenAddress_not?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tokenAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  walletAddress?: InputMaybe<Scalars['String']['input']>;
  walletAddress_contains?: InputMaybe<Scalars['String']['input']>;
  walletAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  walletAddress_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  walletAddress_not?: InputMaybe<Scalars['String']['input']>;
  walletAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  walletAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  walletAddress_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  walletAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  walletAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type TerminatorClaimPage = {
  __typename?: 'terminatorClaimPage';
  items: Array<TerminatorClaim>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type TerminatorContract = {
  __typename?: 'terminatorContract';
  address: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  createdAt: Scalars['BigInt']['output'];
  terminations?: Maybe<TerminationPage>;
  token: Scalars['JSON']['output'];
  updatedAt: Scalars['BigInt']['output'];
};

export type TerminatorContractTerminationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TerminationFilter>;
};

export type TerminatorContractFilter = {
  AND?: InputMaybe<Array<InputMaybe<TerminatorContractFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<TerminatorContractFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
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
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
};

export type TerminatorContractPage = {
  __typename?: 'terminatorContractPage';
  items: Array<TerminatorContract>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export enum Tier {
  Reentel = 'Reentel',
  ReentelPro = 'ReentelPro',
  SuperReentel = 'SuperReentel',
}

export type Token = {
  __typename?: 'token';
  address: Scalars['String']['output'];
  balances?: Maybe<BalancePage>;
  chainId: Scalars['Int']['output'];
  createdAt: Scalars['BigInt']['output'];
  decimals: Scalars['Int']['output'];
  factory?: Maybe<TokenFactory>;
  factoryAddress: Scalars['String']['output'];
  hashId: Scalars['String']['output'];
  maxSupply: Scalars['BigInt']['output'];
  name: Scalars['String']['output'];
  reservedSupply: Scalars['BigInt']['output'];
  symbol: Scalars['String']['output'];
  totalSupply: Scalars['BigInt']['output'];
  transfers?: Maybe<TokenTransferPage>;
  updatedAt: Scalars['BigInt']['output'];
};

export type TokenBalancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<BalanceFilter>;
};

export type TokenTransfersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TokenTransferFilter>;
};

export type TokenFactory = {
  __typename?: 'tokenFactory';
  address: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  createdAt: Scalars['BigInt']['output'];
  updatedAt: Scalars['BigInt']['output'];
  whitelistAddress: Scalars['String']['output'];
  whitelistContract?: Maybe<WhitelistContract>;
};

export type TokenFactoryFilter = {
  AND?: InputMaybe<Array<InputMaybe<TokenFactoryFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<TokenFactoryFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
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
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  whitelistAddress?: InputMaybe<Scalars['String']['input']>;
  whitelistAddress_contains?: InputMaybe<Scalars['String']['input']>;
  whitelistAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  whitelistAddress_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  whitelistAddress_not?: InputMaybe<Scalars['String']['input']>;
  whitelistAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  whitelistAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  whitelistAddress_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  whitelistAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  whitelistAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type TokenFactoryPage = {
  __typename?: 'tokenFactoryPage';
  items: Array<TokenFactory>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type TokenFilter = {
  AND?: InputMaybe<Array<InputMaybe<TokenFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<TokenFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
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
  decimals?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  factoryAddress?: InputMaybe<Scalars['String']['input']>;
  factoryAddress_contains?: InputMaybe<Scalars['String']['input']>;
  factoryAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  factoryAddress_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  factoryAddress_not?: InputMaybe<Scalars['String']['input']>;
  factoryAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  factoryAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  factoryAddress_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  factoryAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  factoryAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  hashId?: InputMaybe<Scalars['String']['input']>;
  hashId_contains?: InputMaybe<Scalars['String']['input']>;
  hashId_ends_with?: InputMaybe<Scalars['String']['input']>;
  hashId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  hashId_not?: InputMaybe<Scalars['String']['input']>;
  hashId_not_contains?: InputMaybe<Scalars['String']['input']>;
  hashId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hashId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  hashId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hashId_starts_with?: InputMaybe<Scalars['String']['input']>;
  maxSupply?: InputMaybe<Scalars['BigInt']['input']>;
  maxSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  maxSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  maxSupply_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  maxSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  maxSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  maxSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  maxSupply_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  reservedSupply?: InputMaybe<Scalars['BigInt']['input']>;
  reservedSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  reservedSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  reservedSupply_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  reservedSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  reservedSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  reservedSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  reservedSupply_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  totalSupply?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
};

export type TokenPage = {
  __typename?: 'tokenPage';
  items: Array<Token>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type TokenTransfer = {
  __typename?: 'tokenTransfer';
  address: Scalars['String']['output'];
  amount: Scalars['BigInt']['output'];
  blockNumber: Scalars['BigInt']['output'];
  chainId: Scalars['Int']['output'];
  event?: Maybe<Ev>;
  from: Scalars['String']['output'];
  logIndex: Scalars['Int']['output'];
  timestamp: Scalars['BigInt']['output'];
  to: Scalars['String']['output'];
  token?: Maybe<Token>;
  transactionHash: Scalars['String']['output'];
};

export type TokenTransferFilter = {
  AND?: InputMaybe<Array<InputMaybe<TokenTransferFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<TokenTransferFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  from?: InputMaybe<Scalars['String']['input']>;
  from_contains?: InputMaybe<Scalars['String']['input']>;
  from_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  from_not?: InputMaybe<Scalars['String']['input']>;
  from_not_contains?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  from_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_starts_with?: InputMaybe<Scalars['String']['input']>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  to?: InputMaybe<Scalars['String']['input']>;
  to_contains?: InputMaybe<Scalars['String']['input']>;
  to_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  to_not?: InputMaybe<Scalars['String']['input']>;
  to_not_contains?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  to_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type TokenTransferPage = {
  __typename?: 'tokenTransferPage';
  items: Array<TokenTransfer>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
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

export type Vault = {
  __typename?: 'vault';
  account?: Maybe<Account>;
  address: Scalars['String']['output'];
  balances?: Maybe<VaultBalancePage>;
  chainId: Scalars['Int']['output'];
  createdAt: Scalars['BigInt']['output'];
  ownerAddress: Scalars['String']['output'];
  wallet?: Maybe<Wallet>;
};

export type VaultBalancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<VaultBalanceFilter>;
};

export type VaultBalance = {
  __typename?: 'vaultBalance';
  amount: Scalars['BigInt']['output'];
  chainId: Scalars['Int']['output'];
  createdAt: Scalars['BigInt']['output'];
  ownerAddress: Scalars['String']['output'];
  token: Scalars['JSON']['output'];
  tokenAddress: Scalars['String']['output'];
  updatedAt: Scalars['BigInt']['output'];
  vault?: Maybe<Vault>;
  vaultAddress: Scalars['String']['output'];
};

export type VaultBalanceFilter = {
  AND?: InputMaybe<Array<InputMaybe<VaultBalanceFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<VaultBalanceFilter>>>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
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
  ownerAddress?: InputMaybe<Scalars['String']['input']>;
  ownerAddress_contains?: InputMaybe<Scalars['String']['input']>;
  ownerAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  ownerAddress_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ownerAddress_not?: InputMaybe<Scalars['String']['input']>;
  ownerAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  ownerAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  ownerAddress_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ownerAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  ownerAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_contains?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tokenAddress_not?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tokenAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  vaultAddress?: InputMaybe<Scalars['String']['input']>;
  vaultAddress_contains?: InputMaybe<Scalars['String']['input']>;
  vaultAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  vaultAddress_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  vaultAddress_not?: InputMaybe<Scalars['String']['input']>;
  vaultAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  vaultAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vaultAddress_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  vaultAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vaultAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type VaultBalancePage = {
  __typename?: 'vaultBalancePage';
  items: Array<VaultBalance>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type VaultFilter = {
  AND?: InputMaybe<Array<InputMaybe<VaultFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<VaultFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
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
  ownerAddress?: InputMaybe<Scalars['String']['input']>;
  ownerAddress_contains?: InputMaybe<Scalars['String']['input']>;
  ownerAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  ownerAddress_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ownerAddress_not?: InputMaybe<Scalars['String']['input']>;
  ownerAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  ownerAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  ownerAddress_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ownerAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  ownerAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type VaultPage = {
  __typename?: 'vaultPage';
  items: Array<Vault>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type Wallet = {
  __typename?: 'wallet';
  accounts?: Maybe<AccountPage>;
  address: Scalars['String']['output'];
  balances?: Maybe<BalancePage>;
  createdAt: Scalars['BigInt']['output'];
  dividendClaims?: Maybe<DividendClaimPage>;
  rntBalances?: Maybe<RntBalancePage>;
  terminatorClaims?: Maybe<TerminatorClaimPage>;
  vaults?: Maybe<VaultPage>;
  whitelistRegistries?: Maybe<WalletWhitelistRegistryPage>;
};

export type WalletAccountsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<AccountFilter>;
};

export type WalletBalancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<BalanceFilter>;
};

export type WalletDividendClaimsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<DividendClaimFilter>;
};

export type WalletRntBalancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<RntBalanceFilter>;
};

export type WalletTerminatorClaimsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<TerminatorClaimFilter>;
};

export type WalletVaultsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<VaultFilter>;
};

export type WalletWhitelistRegistriesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<WalletWhitelistRegistryFilter>;
};

export type WalletFilter = {
  AND?: InputMaybe<Array<InputMaybe<WalletFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<WalletFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
};

export type WalletPage = {
  __typename?: 'walletPage';
  items: Array<Wallet>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type WalletWhitelistRegistry = {
  __typename?: 'walletWhitelistRegistry';
  account?: Maybe<Account>;
  address: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  createdAt: Scalars['BigInt']['output'];
  hashId: Scalars['String']['output'];
  wallet?: Maybe<Wallet>;
  whitelist?: Maybe<Whitelist>;
  whitelistAddress: Scalars['String']['output'];
};

export type WalletWhitelistRegistryFilter = {
  AND?: InputMaybe<Array<InputMaybe<WalletWhitelistRegistryFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<WalletWhitelistRegistryFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
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
  hashId?: InputMaybe<Scalars['String']['input']>;
  hashId_contains?: InputMaybe<Scalars['String']['input']>;
  hashId_ends_with?: InputMaybe<Scalars['String']['input']>;
  hashId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  hashId_not?: InputMaybe<Scalars['String']['input']>;
  hashId_not_contains?: InputMaybe<Scalars['String']['input']>;
  hashId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hashId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  hashId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hashId_starts_with?: InputMaybe<Scalars['String']['input']>;
  whitelistAddress?: InputMaybe<Scalars['String']['input']>;
  whitelistAddress_contains?: InputMaybe<Scalars['String']['input']>;
  whitelistAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  whitelistAddress_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  whitelistAddress_not?: InputMaybe<Scalars['String']['input']>;
  whitelistAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  whitelistAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  whitelistAddress_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  whitelistAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  whitelistAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type WalletWhitelistRegistryPage = {
  __typename?: 'walletWhitelistRegistryPage';
  items: Array<WalletWhitelistRegistry>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type WebhookError = {
  __typename?: 'webhookError';
  address: Scalars['String']['output'];
  blockNumber: Scalars['BigInt']['output'];
  chainId: Scalars['Int']['output'];
  error: Scalars['String']['output'];
  logIndex: Scalars['Int']['output'];
  ponderEvent: Scalars['String']['output'];
  timestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['String']['output'];
};

export type WebhookErrorFilter = {
  AND?: InputMaybe<Array<InputMaybe<WebhookErrorFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<WebhookErrorFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  error?: InputMaybe<Scalars['String']['input']>;
  error_contains?: InputMaybe<Scalars['String']['input']>;
  error_ends_with?: InputMaybe<Scalars['String']['input']>;
  error_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  error_not?: InputMaybe<Scalars['String']['input']>;
  error_not_contains?: InputMaybe<Scalars['String']['input']>;
  error_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  error_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  error_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  error_starts_with?: InputMaybe<Scalars['String']['input']>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  ponderEvent?: InputMaybe<Scalars['String']['input']>;
  ponderEvent_contains?: InputMaybe<Scalars['String']['input']>;
  ponderEvent_ends_with?: InputMaybe<Scalars['String']['input']>;
  ponderEvent_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ponderEvent_not?: InputMaybe<Scalars['String']['input']>;
  ponderEvent_not_contains?: InputMaybe<Scalars['String']['input']>;
  ponderEvent_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  ponderEvent_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ponderEvent_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  ponderEvent_starts_with?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type WebhookErrorPage = {
  __typename?: 'webhookErrorPage';
  items: Array<WebhookError>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type Whitelist = {
  __typename?: 'whitelist';
  address: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  contract?: Maybe<WhitelistContract>;
  createdAt: Scalars['BigInt']['output'];
  hashId: Scalars['String']['output'];
  tokenRegistries?: Maybe<WhitelistTokenRegistryPage>;
  walletRegistries?: Maybe<WalletWhitelistRegistryPage>;
};

export type WhitelistTokenRegistriesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<WhitelistTokenRegistryFilter>;
};

export type WhitelistWalletRegistriesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<WalletWhitelistRegistryFilter>;
};

export type WhitelistContract = {
  __typename?: 'whitelistContract';
  address: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  createdAt: Scalars['BigInt']['output'];
  whitelists?: Maybe<WhitelistPage>;
};

export type WhitelistContractWhitelistsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<WhitelistFilter>;
};

export type WhitelistContractFilter = {
  AND?: InputMaybe<Array<InputMaybe<WhitelistContractFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<WhitelistContractFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
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
};

export type WhitelistContractPage = {
  __typename?: 'whitelistContractPage';
  items: Array<WhitelistContract>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type WhitelistFilter = {
  AND?: InputMaybe<Array<InputMaybe<WhitelistFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<WhitelistFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
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
  hashId?: InputMaybe<Scalars['String']['input']>;
  hashId_contains?: InputMaybe<Scalars['String']['input']>;
  hashId_ends_with?: InputMaybe<Scalars['String']['input']>;
  hashId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  hashId_not?: InputMaybe<Scalars['String']['input']>;
  hashId_not_contains?: InputMaybe<Scalars['String']['input']>;
  hashId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hashId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  hashId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hashId_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type WhitelistPage = {
  __typename?: 'whitelistPage';
  items: Array<Whitelist>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type WhitelistTokenRegistry = {
  __typename?: 'whitelistTokenRegistry';
  address: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  createdAt: Scalars['BigInt']['output'];
  hashId: Scalars['String']['output'];
  tokenAddress: Scalars['String']['output'];
  updatedAt: Scalars['BigInt']['output'];
  whitelist?: Maybe<Whitelist>;
};

export type WhitelistTokenRegistryFilter = {
  AND?: InputMaybe<Array<InputMaybe<WhitelistTokenRegistryFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<WhitelistTokenRegistryFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
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
  hashId?: InputMaybe<Scalars['String']['input']>;
  hashId_contains?: InputMaybe<Scalars['String']['input']>;
  hashId_ends_with?: InputMaybe<Scalars['String']['input']>;
  hashId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  hashId_not?: InputMaybe<Scalars['String']['input']>;
  hashId_not_contains?: InputMaybe<Scalars['String']['input']>;
  hashId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hashId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  hashId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hashId_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_contains?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tokenAddress_not?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tokenAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
};

export type WhitelistTokenRegistryPage = {
  __typename?: 'whitelistTokenRegistryPage';
  items: Array<WhitelistTokenRegistry>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type XRntTransfer = {
  __typename?: 'xRntTransfer';
  address: Scalars['String']['output'];
  blockNumber: Scalars['BigInt']['output'];
  chainId: Scalars['Int']['output'];
  endDate: Scalars['BigInt']['output'];
  escrowedAmount: Scalars['BigInt']['output'];
  from: Scalars['String']['output'];
  logIndex: Scalars['Int']['output'];
  startDate: Scalars['BigInt']['output'];
  timestamp: Scalars['BigInt']['output'];
  to: Scalars['String']['output'];
  tokenId: Scalars['BigInt']['output'];
  transactionHash: Scalars['String']['output'];
  votingUnits: Scalars['BigInt']['output'];
};

export type XRntTransferFilter = {
  AND?: InputMaybe<Array<InputMaybe<XRntTransferFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<XRntTransferFilter>>>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  endDate?: InputMaybe<Scalars['BigInt']['input']>;
  endDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endDate_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  endDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  endDate_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  escrowedAmount?: InputMaybe<Scalars['BigInt']['input']>;
  escrowedAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  escrowedAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  escrowedAmount_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  escrowedAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  escrowedAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  escrowedAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  escrowedAmount_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  from?: InputMaybe<Scalars['String']['input']>;
  from_contains?: InputMaybe<Scalars['String']['input']>;
  from_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  from_not?: InputMaybe<Scalars['String']['input']>;
  from_not_contains?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  from_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_starts_with?: InputMaybe<Scalars['String']['input']>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  startDate?: InputMaybe<Scalars['BigInt']['input']>;
  startDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  startDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  startDate_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  startDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  startDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  startDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  startDate_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  to?: InputMaybe<Scalars['String']['input']>;
  to_contains?: InputMaybe<Scalars['String']['input']>;
  to_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  to_not?: InputMaybe<Scalars['String']['input']>;
  to_not_contains?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  to_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenId?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  tokenId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_not?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  votingUnits?: InputMaybe<Scalars['BigInt']['input']>;
  votingUnits_gt?: InputMaybe<Scalars['BigInt']['input']>;
  votingUnits_gte?: InputMaybe<Scalars['BigInt']['input']>;
  votingUnits_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  votingUnits_lt?: InputMaybe<Scalars['BigInt']['input']>;
  votingUnits_lte?: InputMaybe<Scalars['BigInt']['input']>;
  votingUnits_not?: InputMaybe<Scalars['BigInt']['input']>;
  votingUnits_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
};

export type XRntTransferPage = {
  __typename?: 'xRntTransferPage';
  items: Array<XRntTransfer>;
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
