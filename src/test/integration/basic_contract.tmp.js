// src/test/integration/basic_contract.ts
import { PrivateKey as PrivateKey2, SmartContract as SmartContract2, Field as Field6, method as method2, isReady as isReady2 } from "snarkyjs";

// src/create_rollup.ts
import { isReady } from "snarkyjs";

// src/proof_system/state_transition.ts
import { Bool, Circuit, Field, Poseidon, Struct, UInt32, UInt64 } from "snarkyjs";
var EpochDefault = {
  epochLength: UInt32.from(0),
  ledger: {
    hash: Field(0),
    totalCurrency: UInt64.from(0)
  },
  lockCheckpoint: Field(0),
  seed: Field(0),
  startCheckpoint: Field(0)
};
var NetworkState = class extends Struct({
  snarkedLedgerHash: Field,
  blockchainLength: UInt32,
  minWindowDensity: UInt32,
  totalCurrency: UInt64,
  globalSlotSinceGenesis: UInt32,
  stakingEpochData: {
    ledger: {
      hash: Field,
      totalCurrency: UInt64
    },
    seed: Field,
    startCheckpoint: Field,
    lockCheckpoint: Field,
    epochLength: UInt32
  },
  nextEpochData: {
    ledger: {
      hash: Field,
      totalCurrency: UInt64
    },
    seed: Field,
    startCheckpoint: Field,
    lockCheckpoint: Field,
    epochLength: UInt32
  }
}) {
  static empty() {
    return new NetworkState({
      globalSlotSinceGenesis: UInt32.from(0),
      snarkedLedgerHash: Field(0),
      nextEpochData: EpochDefault,
      stakingEpochData: EpochDefault,
      blockchainLength: UInt32.from(0),
      minWindowDensity: UInt32.from(0),
      totalCurrency: UInt64.from(0)
    });
  }
};
var RollupState = class extends Struct({
  pendingDepositsCommitment: Field,
  accountDbCommitment: Field,
  network: NetworkState
}) {
  static hash(s2) {
    return Poseidon.hash(RollupState.toFields(s2));
  }
  hash() {
    return RollupState.hash(this);
  }
};
var StateTransition = class extends Struct({
  source: RollupState,
  target: RollupState
}) {
  static hash(s2) {
    return Poseidon.hash(StateTransition.toFields(s2));
  }
  hash() {
    return StateTransition.hash(this);
  }
};

// src/proof_system/prover.ts
import { Experimental } from "snarkyjs";
function Prover(userContract) {
  class ContractProof extends userContract.Proof() {
  }
  const RollupProver = Experimental.ZkProgram({
    publicInput: StateTransition,
    methods: {
      proveTransactionBatch: {
        privateInputs: [ContractProof],
        // @ts-ignore
        method(publicInput, p1) {
          p1.verify();
          publicInput.hash().assertEquals(publicInput.hash());
        }
      }
    }
  });
  let RollupStateTransitionProof_ = Experimental.ZkProgram.Proof(RollupProver);
  class RollupStateTransitionProof extends RollupStateTransitionProof_ {
  }
  return {
    RollupProver,
    ProofClass: RollupStateTransitionProof,
    PublicInputType: StateTransition
  };
}

// src/lib/data_store/DepositStore.ts
import { Field as Field3, MerkleWitness as MerkleWitness2 } from "snarkyjs";

// src/lib/data_store/KeyedMemoryStore.ts
import { MerkleTree, Field as Field2, Poseidon as Poseidon2, MerkleWitness } from "snarkyjs";
var Witness = class extends MerkleWitness(255) {
  static empty() {
    let w = [];
    for (let index = 0; index < 255 - 1; index++) {
      w.push({ isLeft: false, sibling: Field2.zero });
    }
    return new Witness(w);
  }
};
var KeyedMemoryStore = class extends Map {
  constructor(height) {
    super();
    this.height = height;
    this.merkleTree = new MerkleTree(height);
  }
  /**
   * Gets the merkle root of the current structure
   * @returns Merkle root or undefined if not found
   */
  getMerkleRoot() {
    return this.merkleTree.getRoot();
  }
  /**
   * Returns the proof corresponding to value at a given key
   * @param key Key of the element in the map
   * @returns Merkle path
   */
  getProof(key) {
    return new Witness(this.merkleTree.getWitness(key));
  }
  /**
   * Gets a value by its key
   * @param key
   * @returns value or undefined if not found
   */
  get(key) {
    return super.get(key);
  }
  /**
   * Sets or adds a new value and key to the data store
   * @param key Key
   * @param value Value
   * @returns true if successful
   */
  set(key, value) {
    super.set(key, value);
    this.merkleTree.setLeaf(key, Poseidon2.hash(value.toFields()));
    return this;
  }
  keyByValue(value) {
    let value_ = Poseidon2.hash(value.toFields());
    for (let [key, v] of this.entries()) {
      if (Poseidon2.hash(v.toFields()).equals(value_).toBoolean())
        return key;
    }
    return void 0;
  }
};

// src/lib/data_store/DepositStore.ts
var DepositStore = class extends KeyedMemoryStore {
  constructor() {
    super(8);
  }
  keyByPublicKey(pub) {
    for (let [key, v] of this.entries()) {
      if (v.publicKey.equals(pub).toBoolean())
        return key;
    }
    return void 0;
  }
};
var DepositWitness = class extends MerkleWitness2(8) {
  static empty() {
    let w = [];
    for (let index = 0; index < 8 - 1; index++) {
      w.push({ isLeft: false, sibling: Field3.zero });
    }
    return new DepositWitness(w);
  }
};

// src/lib/data_store/AccountStore.ts
import { Field as Field4, MerkleWitness as MerkleWitness3 } from "snarkyjs";
var AccountStore = class extends KeyedMemoryStore {
  constructor() {
    super(255);
  }
  keyByPublicKey(pub) {
    for (let [key, v] of this.entries()) {
      if (v.publicKey.equals(pub).toBoolean())
        return key;
    }
    return void 0;
  }
};
var AccountWitness = class extends MerkleWitness3(255) {
  static empty() {
    let w = [];
    for (let index = 0; index < 255 - 1; index++) {
      w.push({ isLeft: false, sibling: Field4.zero });
    }
    return new AccountWitness(w);
  }
};

// src/rollup_operator/events/gobaleventhandler.ts
import { EventEmitter } from "events";
var GlobalEventHandler = new EventEmitter();
GlobalEventHandler.on("myEvent", (data) => {
  console.log(data, "- FIRST");
});
var gobaleventhandler_default = GlobalEventHandler;

// src/rollup_operator/services/Service.ts
var Service = class {
  constructor(globalState, eventHandler) {
    this.globalState = globalState;
    this.eventHandler = eventHandler;
  }
};

// src/rollup_operator/services/RollupService.ts
var RollupService = class extends Service {
  constructor(globalState, eventHandler, prover, contract) {
    super(globalState, eventHandler);
    this.prover = prover;
    this.contract = contract;
  }
  async produceTransactionBatch() {
  }
  /**
   * Verifies a tx signature
   * @param tx tx signature to verify
   * @returns true if signature is valid
   */
  /*   async verify(tx: ITransaction): Promise<boolean> {
    try {
      let rTx = RollupTransaction.fromInterface(tx);
      return rTx.signature.verify(rTx.from, rTx.toFields()).toBoolean();
    } catch (error) {
      return false;
    }
  } */
  async processTransaction(tx) {
  }
};

// src/rollup_operator/services/setupService.ts
import express from "express";
import cors from "cors";
import http from "http";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";

// src/rollup_operator/controllers/schema.ts
import { gql } from "apollo-server-express";
import fs from "fs";
var importGraphQL = (file) => {
  return fs.readFileSync(file, "utf-8");
};
var gqlWrapper = (...files) => {
  return gql`
    ${files}
  `;
};
var s = importGraphQL("./src/rollup_operator/controllers/schema.graphql");
var Schema = gqlWrapper(s);

// src/rollup_operator/controllers/resolvers.ts
function Resolvers(rs) {
  return {
    Query: {
      getGlobalState: () => {
        return {
          pendingDeposits: [""],
          state: {
            committed: {
              pendingDepositsCommitment: "String",
              accountDbCommitment: "String"
            },
            current: {
              pendingDepositsCommitment: "String",
              accountDbCommitment: "String"
            }
          }
        };
      }
    },
    Mutation: {
      sendZkapp: async (_, { input: x }) => {
        console.log(JSON.stringify(x));
        return "xxxx";
      }
    }
  };
}

// src/rollup_operator/services/setupService.ts
function setupService(globalState, p, contract) {
  const app = express();
  app.use(cors());
  const httpServer = http.createServer(app);
  const rs = new RollupService(globalState, gobaleventhandler_default, p, contract);
  const resolvers = Resolvers(rs);
  const graphql = new ApolloServer({
    typeDefs: Schema,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  });
  return {
    async start(port) {
      await graphql.start();
      graphql.applyMiddleware({ app });
      httpServer.listen({ port });
    }
  };
}

// src/zkapp/rollup_contract.ts
import { SmartContract, State, Permissions, Signature, Field as Field5, PrivateKey, Experimental as Experimental2, state, method } from "snarkyjs";
var __decorate = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = function(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
};
function RollupContract(privateKey, prover) {
  var _a2;
  let priv = PrivateKey.fromBase58(privateKey);
  let pub = priv.toPublicKey();
  class RollupStateTransitionProof extends Experimental2.ZkProgram.Proof(prover) {
  }
  class RollupZkApp extends SmartContract {
    constructor() {
      super(...arguments);
      this.privileged = pub;
      this.currentState = State();
      this.events = {
        stateTransition: StateTransition,
        deposit: Field5,
        forceWithdraw: Field5
        // TODO
      };
    }
    deploy(args) {
      super.deploy(args);
      this.setPermissions({
        ...Permissions.default(),
        editState: Permissions.proofOrSignature(),
        send: Permissions.proofOrSignature()
      });
    }
    /*     @method deposit(deposit: RollupDeposit) {
          deposit.signature.verify(deposit.publicKey, deposit.toFields());
    
          let currentState = this.currentState.get();
          this.currentState.assertEquals(currentState);
    
          // slot must be empty before we can process deposits
    
          deposit.merkleProof
            .calculateRoot(Field.zero)
            .assertEquals(currentState.pendingDepositsCommitment);
    
          let newRoot = deposit.merkleProof.calculateRoot(deposit.getHash());
          let index = deposit.merkleProof.calculateIndex();
    
          deposit.leafIndex.assertEquals(index);
    
          this.balance.addInPlace(deposit.amount);
          this.emitEvent('deposit', deposit);
    
          let newState = new RollupState({
            pendingDepositsCommitment: newRoot,
            accountDbCommitment: currentState.accountDbCommitment,
          });
          this.currentState.set(newState);
        } */
    /*     @method forceWithdraw(tx: RollupTransaction) {
          let currentState = this.currentState.get();
          this.currentState.assertEquals(currentState);
    
          let tempRoot = tx.sender.witness.calculateRoot(tx.sender.hash());
          tempRoot.assertEquals(currentState.accountDbCommitment);
    
          //  ! TODO
    
          // apply amount diff and transition to new state
          // emit event
        } */
    verifyBatch(stateTransitionProof, sig) {
    }
  }
  __decorate([
    state(RollupState),
    __metadata("design:type", Object)
  ], RollupZkApp.prototype, "currentState", void 0);
  __decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RollupStateTransitionProof, typeof (_a2 = typeof Signature !== "undefined" && Signature) === "function" ? _a2 : Object]),
    __metadata("design:returntype", void 0)
  ], RollupZkApp.prototype, "verifyBatch", null);
  return RollupZkApp;
}

// src/proof_aggregator/src/lib/cloud_api.ts
import { DescribeInstancesCommand, EC2Client, RebootInstancesCommand, RunInstancesCommand, StartInstancesCommand, StopInstancesCommand, TerminateInstancesCommand } from "@aws-sdk/client-ec2";
var DryRun = process.env.AWS_DRY_RUN == "true" ? true : false;
var Region;
(function(Region2) {
  Region2["US_EAST_1"] = "us-east-1";
})(Region || (Region = {}));

// src/proof_aggregator/src/lib/coordinator.ts
import jayson from "jayson/promise/index.js";

// src/proof_aggregator/src/lib/logger.ts
var logger = {
  info(msg) {
    console.log("[", new Date().toLocaleString(), "]", "\x1B[36m", msg, "\x1B[0m");
  },
  log(msg) {
    console.log("[", new Date().toLocaleString(), "]", msg);
  },
  error(msg) {
    console.log("[", new Date().toLocaleString(), "]", "\x1B[31m", msg, "\x1B[0m");
  },
  warn(msg) {
    console.log("[", new Date().toLocaleString(), "]", "\x1B[33m", msg, "\x1B[0m");
  }
};

// src/proof_aggregator/src/lib/coordinator.ts
var State2;
(function(State3) {
  State3["NOT_CONNECTED"] = "not_connected";
  State3["IDLE"] = "idle";
  State3["WORKING"] = "working";
  State3["TERMINATED"] = "terminated";
})(State2 || (State2 = {}));

// src/proof_aggregator/src/lib/poll.ts
import axios from "axios";

// src/create_rollup.ts
async function zkRollup(userContract, feePayer, contractAddress) {
  let sequencer = {
    port: 3e3,
    depositHeight: 10,
    batchSize: 6
  };
  let network_endpoint = "https://proxy.berkeley.minaexplorer.com/graphql";
  let isDeployed = false;
  await isReady;
  await userContract.compile();
  console.log(1);
  let { RollupProver, ProofClass, PublicInputType } = Prover(userContract);
  let compiledProver = await RollupProver.compile();
  console.log(2);
  const RollupZkapp = RollupContract(feePayer, RollupProver);
  console.log(3);
  let compiledContract = await RollupZkapp.compile();
  console.log(4);
  let accountStore = new AccountStore();
  let depositStore = new DepositStore();
  let transactionPool = [];
  let transactionHistory = [];
  let accountRoot = accountStore.getMerkleRoot();
  let depositRoot = depositStore.getMerkleRoot();
  let globalState = {
    accountTree: accountStore,
    transactionPool,
    transactionHistory,
    pendingDeposits: depositStore,
    state: {
      // represents the actual on-chain state
      committed: new RollupState({
        accountDbCommitment: accountRoot,
        pendingDepositsCommitment: depositRoot,
        network: NetworkState.empty()
      }),
      // represents the current rollup state
      current: new RollupState({
        accountDbCommitment: accountRoot,
        pendingDepositsCommitment: depositRoot,
        network: NetworkState.empty()
      })
    }
  };
  let rollup = setupService(globalState, RollupProver, RollupZkapp);
  return {
    async start(port) {
      await rollup.start(port);
      logger.log(`Graphql server running on http://localhost:${port}/graphql`);
      console.error("Not further implemented");
      return new Promise(() => {
      });
    },
    async deploy() {
      throw Error("Not implemented");
    }
  };
}

// src/test/integration/basic_contract.ts
var __decorate2 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata2 = function(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
};
var _a;
await isReady2;
var MyContract = class extends SmartContract2 {
  update(x) {
    x.assertEquals(1);
  }
};
__decorate2([
  method2,
  __metadata2("design:type", Function),
  __metadata2("design:paramtypes", [typeof (_a = typeof Field6 !== "undefined" && Field6) === "function" ? _a : Object]),
  __metadata2("design:returntype", void 0)
], MyContract.prototype, "update", null);
await MyContract.compile();
var feePayerKey = PrivateKey2.random();
var contractKey = PrivateKey2.random();
var Sequencer = await zkRollup(MyContract, feePayerKey.toBase58(), contractKey.toBase58());
await Sequencer.start(3e3);
console.log("furter");
