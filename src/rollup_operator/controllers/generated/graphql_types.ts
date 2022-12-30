import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AccountPreconditionInput = {
  balance?: InputMaybe<LowerUpper>;
  delegate?: InputMaybe<Scalars['String']>;
  isNew?: InputMaybe<Scalars['Boolean']>;
  nonce?: InputMaybe<LowerUpper>;
  provedState?: InputMaybe<Scalars['Boolean']>;
  receiptChainHash?: InputMaybe<Scalars['String']>;
  sequenceState?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type AccountUpdate = {
  authorization: ProofOrSignature;
  body: Body;
};

export type AuthRequired = {
  a?: InputMaybe<Scalars['String']>;
};

export type BalanceChange = {
  magnitude: Scalars['String'];
  sgn: Scalars['String'];
};

export type Body = {
  authorizationKind: Scalars['String'];
  balanceChange: BalanceChange;
  callData: Scalars['String'];
  callDepth: Scalars['Int'];
  caller: Scalars['String'];
  events: Array<Array<Scalars['String']>>;
  incrementNonce: Scalars['Boolean'];
  preconditions: Preconditions;
  publicKey: Scalars['String'];
  sequenceEvents: Array<Array<Scalars['String']>>;
  tokenId: Scalars['String'];
  update: Update;
  useFullCommitment: Scalars['Boolean'];
};

export type Commitment = {
  __typename?: 'Commitment';
  accountDbCommitment?: Maybe<Scalars['String']>;
  pendingDepositsCommitment?: Maybe<Scalars['String']>;
};

export type EpochData = {
  epochLength?: InputMaybe<LowerUpper>;
  ledger: EpochLedger;
  lockCheckpoint?: InputMaybe<Scalars['String']>;
  seed?: InputMaybe<Scalars['String']>;
  startCheckpoint?: InputMaybe<Scalars['String']>;
};

export type EpochLedger = {
  hash?: InputMaybe<Scalars['String']>;
  totalCurrency?: InputMaybe<LowerUpper>;
};

export type FeePayer = {
  authorization: Scalars['String'];
  body: FeePayerBody;
};

export type FeePayerBody = {
  fee: Scalars['String'];
  nonce: Scalars['String'];
  publicKey: Scalars['String'];
  validUntil?: InputMaybe<Scalars['Int']>;
};

export type GlobalState = {
  __typename?: 'GlobalState';
  pendingDeposits?: Maybe<Array<Maybe<Scalars['String']>>>;
  state?: Maybe<State>;
};

export type LowerUpper = {
  lower: Scalars['String'];
  upper: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  sendZkapp?: Maybe<Scalars['String']>;
};


export type MutationSendZkappArgs = {
  input: ZkappCommandInput;
};

export type NetworkPreconditionInput = {
  blockchainLength?: InputMaybe<LowerUpper>;
  globalSlotSinceGenesis?: InputMaybe<LowerUpper>;
  globalSlotSinceHardFork?: InputMaybe<LowerUpper>;
  minWindowDensity?: InputMaybe<LowerUpper>;
  nextEpochData: EpochData;
  snarkedLedgerHash?: InputMaybe<Scalars['String']>;
  stakingEpochData: EpochData;
  timestamp?: InputMaybe<LowerUpper>;
  totalCurrency?: InputMaybe<LowerUpper>;
};

export type Permissions = {
  editSequenceState?: InputMaybe<AuthRequired>;
  editState?: InputMaybe<AuthRequired>;
  incrementNonce?: InputMaybe<AuthRequired>;
  receive?: InputMaybe<AuthRequired>;
  send?: InputMaybe<AuthRequired>;
  setDelegate?: InputMaybe<AuthRequired>;
  setPermissions?: InputMaybe<AuthRequired>;
  setTokenSymbol?: InputMaybe<AuthRequired>;
  setVerificationKey?: InputMaybe<AuthRequired>;
  setVotingFor?: InputMaybe<AuthRequired>;
  setZkappUri?: InputMaybe<AuthRequired>;
};

export type Preconditions = {
  account?: InputMaybe<AccountPreconditionInput>;
  network?: InputMaybe<NetworkPreconditionInput>;
};

export type ProofOrSignature = {
  proof?: InputMaybe<Scalars['String']>;
  signature?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  getGlobalState?: Maybe<GlobalState>;
};

export type State = {
  __typename?: 'State';
  committed?: Maybe<Commitment>;
  current?: Maybe<Commitment>;
};

export type TimingInput = {
  cliffAmount?: InputMaybe<Scalars['String']>;
  cliffTime?: InputMaybe<Scalars['String']>;
  initialMinimumBalance?: InputMaybe<Scalars['String']>;
  vestingIncrement?: InputMaybe<Scalars['String']>;
  vestingPeriod?: InputMaybe<Scalars['String']>;
};

export type Update = {
  appState?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  delegate?: InputMaybe<Scalars['String']>;
  permissions?: InputMaybe<Permissions>;
  timing?: InputMaybe<TimingInput>;
  tokenSymbol?: InputMaybe<Scalars['String']>;
  verificationKey?: InputMaybe<VerificationKey>;
  votingFor?: InputMaybe<Scalars['String']>;
  zkappUri?: InputMaybe<Scalars['String']>;
};

export type VerificationKey = {
  data?: InputMaybe<Scalars['String']>;
  hash?: InputMaybe<Scalars['String']>;
};

export type ZkappCommandInput = {
  accountUpdates: Array<AccountUpdate>;
  feePayer: FeePayer;
  memo: Scalars['String'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AccountPreconditionInput: AccountPreconditionInput;
  AccountUpdate: AccountUpdate;
  AuthRequired: AuthRequired;
  BalanceChange: BalanceChange;
  Body: Body;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Commitment: ResolverTypeWrapper<Commitment>;
  EpochData: EpochData;
  EpochLedger: EpochLedger;
  FeePayer: FeePayer;
  FeePayerBody: FeePayerBody;
  GlobalState: ResolverTypeWrapper<GlobalState>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  LowerUpper: LowerUpper;
  Mutation: ResolverTypeWrapper<{}>;
  NetworkPreconditionInput: NetworkPreconditionInput;
  Permissions: Permissions;
  Preconditions: Preconditions;
  ProofOrSignature: ProofOrSignature;
  Query: ResolverTypeWrapper<{}>;
  State: ResolverTypeWrapper<State>;
  String: ResolverTypeWrapper<Scalars['String']>;
  TimingInput: TimingInput;
  Update: Update;
  VerificationKey: VerificationKey;
  ZkappCommandInput: ZkappCommandInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AccountPreconditionInput: AccountPreconditionInput;
  AccountUpdate: AccountUpdate;
  AuthRequired: AuthRequired;
  BalanceChange: BalanceChange;
  Body: Body;
  Boolean: Scalars['Boolean'];
  Commitment: Commitment;
  EpochData: EpochData;
  EpochLedger: EpochLedger;
  FeePayer: FeePayer;
  FeePayerBody: FeePayerBody;
  GlobalState: GlobalState;
  Int: Scalars['Int'];
  LowerUpper: LowerUpper;
  Mutation: {};
  NetworkPreconditionInput: NetworkPreconditionInput;
  Permissions: Permissions;
  Preconditions: Preconditions;
  ProofOrSignature: ProofOrSignature;
  Query: {};
  State: State;
  String: Scalars['String'];
  TimingInput: TimingInput;
  Update: Update;
  VerificationKey: VerificationKey;
  ZkappCommandInput: ZkappCommandInput;
}>;

export type CommitmentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Commitment'] = ResolversParentTypes['Commitment']> = ResolversObject<{
  accountDbCommitment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pendingDepositsCommitment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GlobalStateResolvers<ContextType = any, ParentType extends ResolversParentTypes['GlobalState'] = ResolversParentTypes['GlobalState']> = ResolversObject<{
  pendingDeposits?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['State']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  sendZkapp?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationSendZkappArgs, 'input'>>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getGlobalState?: Resolver<Maybe<ResolversTypes['GlobalState']>, ParentType, ContextType>;
}>;

export type StateResolvers<ContextType = any, ParentType extends ResolversParentTypes['State'] = ResolversParentTypes['State']> = ResolversObject<{
  committed?: Resolver<Maybe<ResolversTypes['Commitment']>, ParentType, ContextType>;
  current?: Resolver<Maybe<ResolversTypes['Commitment']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Commitment?: CommitmentResolvers<ContextType>;
  GlobalState?: GlobalStateResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  State?: StateResolvers<ContextType>;
}>;

