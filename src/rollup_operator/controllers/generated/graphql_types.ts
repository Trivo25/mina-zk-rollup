import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AccountPreconditionInput = {
  __typename?: 'AccountPreconditionInput';
  balance?: Maybe<LowerUpper>;
  delegate?: Maybe<Scalars['String']>;
  isNew?: Maybe<Scalars['Boolean']>;
  nonce?: Maybe<LowerUpper>;
  provedState?: Maybe<Scalars['Boolean']>;
  receiptChainHash?: Maybe<Scalars['String']>;
  sequenceState?: Maybe<Scalars['String']>;
  state?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AccountUpdate = {
  __typename?: 'AccountUpdate';
  Body?: Maybe<Body>;
  authorization?: Maybe<ProofOrSignature>;
};

export type AuthRequired = {
  __typename?: 'AuthRequired';
  a?: Maybe<Scalars['String']>;
};

export type BalanceChange = {
  __typename?: 'BalanceChange';
  magnitude: Scalars['String'];
  sgn: Scalars['String'];
};

export type Body = {
  __typename?: 'Body';
  authorizationKind?: Maybe<Scalars['String']>;
  balanceChange?: Maybe<BalanceChange>;
  callData?: Maybe<Scalars['String']>;
  callDepth?: Maybe<Scalars['Int']>;
  caller?: Maybe<Scalars['String']>;
  events?: Maybe<Array<Maybe<Array<Maybe<Scalars['String']>>>>>;
  incrementNonce?: Maybe<Scalars['Boolean']>;
  preconditions?: Maybe<Preconditions>;
  publicKey?: Maybe<Scalars['String']>;
  sequenceEvents?: Maybe<Array<Maybe<Array<Maybe<Scalars['String']>>>>>;
  tokenId?: Maybe<Scalars['String']>;
  update?: Maybe<Update>;
  useFullCommitment?: Maybe<Scalars['Boolean']>;
};

export type Commitment = {
  __typename?: 'Commitment';
  accountDbCommitment?: Maybe<Scalars['String']>;
  pendingDepositsCommitment?: Maybe<Scalars['String']>;
};

export type EpochData = {
  __typename?: 'EpochData';
  epochLength?: Maybe<LowerUpper>;
  ledger: EpochLedger;
  lockCheckpoint?: Maybe<Scalars['String']>;
  seed?: Maybe<Scalars['String']>;
  startCheckpoint?: Maybe<Scalars['String']>;
};

export type EpochLedger = {
  __typename?: 'EpochLedger';
  hash?: Maybe<Scalars['String']>;
  totalCurrency?: Maybe<LowerUpper>;
};

export type FeePayer = {
  __typename?: 'FeePayer';
  authorization?: Maybe<Scalars['String']>;
  body?: Maybe<FeePayerBody>;
};

export type FeePayerBody = {
  __typename?: 'FeePayerBody';
  fee?: Maybe<Scalars['Int']>;
  nonce?: Maybe<Scalars['Int']>;
  publicKey?: Maybe<Scalars['String']>;
  validUntil?: Maybe<Scalars['Int']>;
};

export type GlobalState = {
  __typename?: 'GlobalState';
  pendingDeposits?: Maybe<Array<Maybe<Scalars['String']>>>;
  state?: Maybe<State>;
};

export type LowerUpper = {
  __typename?: 'LowerUpper';
  lower: Scalars['String'];
  upper: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  sendZkapp?: Maybe<Scalars['String']>;
};


export type MutationSendZkappArgs = {
  input?: InputMaybe<ZkappCommandInput>;
};

export type NetworkPreconditionInput = {
  __typename?: 'NetworkPreconditionInput';
  blockchainLength?: Maybe<LowerUpper>;
  globalSlotSinceGenesis?: Maybe<LowerUpper>;
  globalSlotSinceHardFork?: Maybe<LowerUpper>;
  minWindowDensity?: Maybe<LowerUpper>;
  nextEpochData: EpochData;
  snarkedLedgerHash?: Maybe<Scalars['String']>;
  stakingEpochData: EpochData;
  timestamp?: Maybe<LowerUpper>;
  totalCurrency?: Maybe<LowerUpper>;
};

export type Permissions = {
  __typename?: 'Permissions';
  editSequenceState: AuthRequired;
  editState: AuthRequired;
  incrementNonce: AuthRequired;
  receive: AuthRequired;
  send: AuthRequired;
  setDelegate: AuthRequired;
  setPermissions: AuthRequired;
  setTokenSymbol: AuthRequired;
  setVerificationKey: AuthRequired;
  setVotingFor: AuthRequired;
  setZkappUri: AuthRequired;
};

export type Preconditions = {
  __typename?: 'Preconditions';
  account: AccountPreconditionInput;
  network: NetworkPreconditionInput;
};

export type ProofOrSignature = {
  __typename?: 'ProofOrSignature';
  proof: Scalars['String'];
  signature: Scalars['String'];
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
  __typename?: 'TimingInput';
  cliffAmount: Scalars['String'];
  cliffTime: Scalars['String'];
  initialMinimumBalance: Scalars['String'];
  vestingIncrement: Scalars['String'];
  vestingPeriod: Scalars['String'];
};

export type Update = {
  __typename?: 'Update';
  appState?: Maybe<Array<Maybe<Scalars['String']>>>;
  delegate?: Maybe<Scalars['String']>;
  permissions?: Maybe<Permissions>;
  timing?: Maybe<TimingInput>;
  tokenSymbol?: Maybe<Scalars['String']>;
  verificationKey?: Maybe<VerificationKey>;
  votingFor?: Maybe<Scalars['String']>;
  zkappUri?: Maybe<Scalars['String']>;
};

export type VerificationKey = {
  __typename?: 'VerificationKey';
  data: Scalars['String'];
  hash: Scalars['String'];
};

export type ZkappCommandInput = {
  __typename?: 'ZkappCommandInput';
  accountUpdates?: Maybe<Array<Maybe<AccountUpdate>>>;
  feePayer?: Maybe<FeePayer>;
  memo?: Maybe<Scalars['String']>;
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
  AccountPreconditionInput: ResolverTypeWrapper<AccountPreconditionInput>;
  AccountUpdate: ResolverTypeWrapper<AccountUpdate>;
  AuthRequired: ResolverTypeWrapper<AuthRequired>;
  BalanceChange: ResolverTypeWrapper<BalanceChange>;
  Body: ResolverTypeWrapper<Body>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Commitment: ResolverTypeWrapper<Commitment>;
  EpochData: ResolverTypeWrapper<EpochData>;
  EpochLedger: ResolverTypeWrapper<EpochLedger>;
  FeePayer: ResolverTypeWrapper<FeePayer>;
  FeePayerBody: ResolverTypeWrapper<FeePayerBody>;
  GlobalState: ResolverTypeWrapper<GlobalState>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  LowerUpper: ResolverTypeWrapper<LowerUpper>;
  Mutation: ResolverTypeWrapper<{}>;
  NetworkPreconditionInput: ResolverTypeWrapper<NetworkPreconditionInput>;
  Permissions: ResolverTypeWrapper<Permissions>;
  Preconditions: ResolverTypeWrapper<Preconditions>;
  ProofOrSignature: ResolverTypeWrapper<ProofOrSignature>;
  Query: ResolverTypeWrapper<{}>;
  State: ResolverTypeWrapper<State>;
  String: ResolverTypeWrapper<Scalars['String']>;
  TimingInput: ResolverTypeWrapper<TimingInput>;
  Update: ResolverTypeWrapper<Update>;
  VerificationKey: ResolverTypeWrapper<VerificationKey>;
  ZkappCommandInput: ResolverTypeWrapper<ZkappCommandInput>;
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

export type AccountPreconditionInputResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountPreconditionInput'] = ResolversParentTypes['AccountPreconditionInput']> = ResolversObject<{
  balance?: Resolver<Maybe<ResolversTypes['LowerUpper']>, ParentType, ContextType>;
  delegate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isNew?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  nonce?: Resolver<Maybe<ResolversTypes['LowerUpper']>, ParentType, ContextType>;
  provedState?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  receiptChainHash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sequenceState?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  state?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccountUpdateResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountUpdate'] = ResolversParentTypes['AccountUpdate']> = ResolversObject<{
  Body?: Resolver<Maybe<ResolversTypes['Body']>, ParentType, ContextType>;
  authorization?: Resolver<Maybe<ResolversTypes['ProofOrSignature']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthRequiredResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthRequired'] = ResolversParentTypes['AuthRequired']> = ResolversObject<{
  a?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BalanceChangeResolvers<ContextType = any, ParentType extends ResolversParentTypes['BalanceChange'] = ResolversParentTypes['BalanceChange']> = ResolversObject<{
  magnitude?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sgn?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BodyResolvers<ContextType = any, ParentType extends ResolversParentTypes['Body'] = ResolversParentTypes['Body']> = ResolversObject<{
  authorizationKind?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  balanceChange?: Resolver<Maybe<ResolversTypes['BalanceChange']>, ParentType, ContextType>;
  callData?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  callDepth?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  caller?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  events?: Resolver<Maybe<Array<Maybe<Array<Maybe<ResolversTypes['String']>>>>>, ParentType, ContextType>;
  incrementNonce?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  preconditions?: Resolver<Maybe<ResolversTypes['Preconditions']>, ParentType, ContextType>;
  publicKey?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sequenceEvents?: Resolver<Maybe<Array<Maybe<Array<Maybe<ResolversTypes['String']>>>>>, ParentType, ContextType>;
  tokenId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  update?: Resolver<Maybe<ResolversTypes['Update']>, ParentType, ContextType>;
  useFullCommitment?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommitmentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Commitment'] = ResolversParentTypes['Commitment']> = ResolversObject<{
  accountDbCommitment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pendingDepositsCommitment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EpochDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['EpochData'] = ResolversParentTypes['EpochData']> = ResolversObject<{
  epochLength?: Resolver<Maybe<ResolversTypes['LowerUpper']>, ParentType, ContextType>;
  ledger?: Resolver<ResolversTypes['EpochLedger'], ParentType, ContextType>;
  lockCheckpoint?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  seed?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startCheckpoint?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EpochLedgerResolvers<ContextType = any, ParentType extends ResolversParentTypes['EpochLedger'] = ResolversParentTypes['EpochLedger']> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalCurrency?: Resolver<Maybe<ResolversTypes['LowerUpper']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FeePayerResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeePayer'] = ResolversParentTypes['FeePayer']> = ResolversObject<{
  authorization?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  body?: Resolver<Maybe<ResolversTypes['FeePayerBody']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FeePayerBodyResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeePayerBody'] = ResolversParentTypes['FeePayerBody']> = ResolversObject<{
  fee?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  nonce?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  publicKey?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  validUntil?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GlobalStateResolvers<ContextType = any, ParentType extends ResolversParentTypes['GlobalState'] = ResolversParentTypes['GlobalState']> = ResolversObject<{
  pendingDeposits?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['State']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LowerUpperResolvers<ContextType = any, ParentType extends ResolversParentTypes['LowerUpper'] = ResolversParentTypes['LowerUpper']> = ResolversObject<{
  lower?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  upper?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  sendZkapp?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<MutationSendZkappArgs>>;
}>;

export type NetworkPreconditionInputResolvers<ContextType = any, ParentType extends ResolversParentTypes['NetworkPreconditionInput'] = ResolversParentTypes['NetworkPreconditionInput']> = ResolversObject<{
  blockchainLength?: Resolver<Maybe<ResolversTypes['LowerUpper']>, ParentType, ContextType>;
  globalSlotSinceGenesis?: Resolver<Maybe<ResolversTypes['LowerUpper']>, ParentType, ContextType>;
  globalSlotSinceHardFork?: Resolver<Maybe<ResolversTypes['LowerUpper']>, ParentType, ContextType>;
  minWindowDensity?: Resolver<Maybe<ResolversTypes['LowerUpper']>, ParentType, ContextType>;
  nextEpochData?: Resolver<ResolversTypes['EpochData'], ParentType, ContextType>;
  snarkedLedgerHash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stakingEpochData?: Resolver<ResolversTypes['EpochData'], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['LowerUpper']>, ParentType, ContextType>;
  totalCurrency?: Resolver<Maybe<ResolversTypes['LowerUpper']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PermissionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Permissions'] = ResolversParentTypes['Permissions']> = ResolversObject<{
  editSequenceState?: Resolver<ResolversTypes['AuthRequired'], ParentType, ContextType>;
  editState?: Resolver<ResolversTypes['AuthRequired'], ParentType, ContextType>;
  incrementNonce?: Resolver<ResolversTypes['AuthRequired'], ParentType, ContextType>;
  receive?: Resolver<ResolversTypes['AuthRequired'], ParentType, ContextType>;
  send?: Resolver<ResolversTypes['AuthRequired'], ParentType, ContextType>;
  setDelegate?: Resolver<ResolversTypes['AuthRequired'], ParentType, ContextType>;
  setPermissions?: Resolver<ResolversTypes['AuthRequired'], ParentType, ContextType>;
  setTokenSymbol?: Resolver<ResolversTypes['AuthRequired'], ParentType, ContextType>;
  setVerificationKey?: Resolver<ResolversTypes['AuthRequired'], ParentType, ContextType>;
  setVotingFor?: Resolver<ResolversTypes['AuthRequired'], ParentType, ContextType>;
  setZkappUri?: Resolver<ResolversTypes['AuthRequired'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PreconditionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Preconditions'] = ResolversParentTypes['Preconditions']> = ResolversObject<{
  account?: Resolver<ResolversTypes['AccountPreconditionInput'], ParentType, ContextType>;
  network?: Resolver<ResolversTypes['NetworkPreconditionInput'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProofOrSignatureResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProofOrSignature'] = ResolversParentTypes['ProofOrSignature']> = ResolversObject<{
  proof?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  signature?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getGlobalState?: Resolver<Maybe<ResolversTypes['GlobalState']>, ParentType, ContextType>;
}>;

export type StateResolvers<ContextType = any, ParentType extends ResolversParentTypes['State'] = ResolversParentTypes['State']> = ResolversObject<{
  committed?: Resolver<Maybe<ResolversTypes['Commitment']>, ParentType, ContextType>;
  current?: Resolver<Maybe<ResolversTypes['Commitment']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TimingInputResolvers<ContextType = any, ParentType extends ResolversParentTypes['TimingInput'] = ResolversParentTypes['TimingInput']> = ResolversObject<{
  cliffAmount?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  cliffTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  initialMinimumBalance?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vestingIncrement?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vestingPeriod?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UpdateResolvers<ContextType = any, ParentType extends ResolversParentTypes['Update'] = ResolversParentTypes['Update']> = ResolversObject<{
  appState?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  delegate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  permissions?: Resolver<Maybe<ResolversTypes['Permissions']>, ParentType, ContextType>;
  timing?: Resolver<Maybe<ResolversTypes['TimingInput']>, ParentType, ContextType>;
  tokenSymbol?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  verificationKey?: Resolver<Maybe<ResolversTypes['VerificationKey']>, ParentType, ContextType>;
  votingFor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  zkappUri?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VerificationKeyResolvers<ContextType = any, ParentType extends ResolversParentTypes['VerificationKey'] = ResolversParentTypes['VerificationKey']> = ResolversObject<{
  data?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ZkappCommandInputResolvers<ContextType = any, ParentType extends ResolversParentTypes['ZkappCommandInput'] = ResolversParentTypes['ZkappCommandInput']> = ResolversObject<{
  accountUpdates?: Resolver<Maybe<Array<Maybe<ResolversTypes['AccountUpdate']>>>, ParentType, ContextType>;
  feePayer?: Resolver<Maybe<ResolversTypes['FeePayer']>, ParentType, ContextType>;
  memo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  AccountPreconditionInput?: AccountPreconditionInputResolvers<ContextType>;
  AccountUpdate?: AccountUpdateResolvers<ContextType>;
  AuthRequired?: AuthRequiredResolvers<ContextType>;
  BalanceChange?: BalanceChangeResolvers<ContextType>;
  Body?: BodyResolvers<ContextType>;
  Commitment?: CommitmentResolvers<ContextType>;
  EpochData?: EpochDataResolvers<ContextType>;
  EpochLedger?: EpochLedgerResolvers<ContextType>;
  FeePayer?: FeePayerResolvers<ContextType>;
  FeePayerBody?: FeePayerBodyResolvers<ContextType>;
  GlobalState?: GlobalStateResolvers<ContextType>;
  LowerUpper?: LowerUpperResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NetworkPreconditionInput?: NetworkPreconditionInputResolvers<ContextType>;
  Permissions?: PermissionsResolvers<ContextType>;
  Preconditions?: PreconditionsResolvers<ContextType>;
  ProofOrSignature?: ProofOrSignatureResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  State?: StateResolvers<ContextType>;
  TimingInput?: TimingInputResolvers<ContextType>;
  Update?: UpdateResolvers<ContextType>;
  VerificationKey?: VerificationKeyResolvers<ContextType>;
  ZkappCommandInput?: ZkappCommandInputResolvers<ContextType>;
}>;

