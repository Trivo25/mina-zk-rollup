---
title: Zero Knowledge Rollup
---

## MVP Zero Knowledge Rollup

_See the [Github repository](https://github.com/Trivo25/mina-zk-rollup) for implementation and more information._

### Documentation

- <a href="#1">1. Description</a>
- <a href="#2">2. Overview</a>
  - <a href="#21">2.1 Architecture</a>
  - <a href="#22">2.2 Components</a>
    - <a href="#221">2.2.1 Layer 1</a>
    - <a href="#222">2.2.2 Rollup layer</a>
    - <a href="#223">2.2.3 Off-chain data storage</a>
    - <a href="#224">2.2.4 Frontend</a>
- <a href="#3">3. Improvements</a>
- <a href="#4">4. Security assumptions and potential problems</a>
- <a href="#5">5. Summary</a>
- <a href="#6">6. References</a>

### Implementation References

- <a href="#impl_1">1. Off-chain Storage Structure</a>
  - <a href="#impl_11">1.1 Merkle Tree</a>
  - <a href="#impl_12">1.2 In-Memory</a>
  - <a href="#impl_13">1.3 IPFS</a>
- <a href="#impl_2">2. API and Interfaces</a>
- <a href="#impl_3">3. Off-chain Methods</a>

## Documentation

### 1. Description <span id="1"></span>

:::warning
<b>The project is still in a design phase. The structure of the rollup might change later on.</b>
:::

A rollup on top of Mina to improve transaction performance. The project is supposed to deliever a "general" rollup which other developers can build on top of or re-use for their applications. The goal is to develop a basic, yet fully functional and secure zk-rollup, including a basic frontend, the on-chain smart contract and the off-chain rollup operator node(s) and data storage.

---

### 2. Overview <span id="2"></span>

Currently, the architecture is based on a _centralised, yet trustless_ setup. That means: transactions will be processed by a central node (the `rollup operator`) while allowing users to withdrawl their funds directly from the L1 smart contract in case of censorship or emergency.

The project consists of 4 major modules, which also consist of smaller components.

1. Mina Protocol as Layer 1
2. zk-Rollup
3. off-chain state
4. frontend

All the components will be explained in more detail later.

---

#### 2.1 Architecture <span id="21"></span>

<img
     src="./img/rollup.svg"
     style="margin-left: 30px; margin-right: 30px; width: 90%"/>

---

#### 2.2 Components <span id="22"></span>

##### 2.2.1 Layer 1 <span id="221"></span>

<img
     src="https://www.proxylabs.org/assets/img/l1_chain.svg"
     style="margin-left: 30px; margin-right: 30px; width: 90%"/>

Mina serves as the layer 1. A rollup smart contract will be deployed to the chain. The contract serves the following purpose:

- the contract will manage all funds
- the contract will hold a merkle root of the off-chain state

The contract will have (at least) the following methods:

- `deposit(amount: UInt64, target: PublicKey)`
  - allows users to deposit funds to the rollup, specifiying and amount and a receiver address
- `emergencyWithdrawal(/* TBD */)`
  - <b>see <a href="#4">4. Security assumptions and potential problems</a></b>
  - will allow users to withdrawl their funds in case the rollup operator decides to either stop functioning or censor the users transactions
- `verifyBatch(/* TBD */)`
  - this method will be called by the rollup operator in order to update and verify the rollup state
- `withdrawTo(* TBD */)`
  - this method wil also be called by the rollup operator in order to withdraw layer 2 funds back to the layer 1 if a user requests it

---

##### 2.2.2 Rollup layer <span id="222"></span>

<img
     src="https://www.proxylabs.org/assets/img/rollup_component.svg"
     style="margin-left: 30px; margin-right: 30px; width: 90%"/>

The actual zk-rollup layer consists of one major part: the _rollup operator_

:::warning
I already have ideas to combat the `centralised but trustless` architecture and change the architecture slightly, see the sections below for more information.
:::

The rollup operator will group up transactions from the transaction pool, process them, update the off-chain state and post a proof of correct execution back to the layer 1 smart contract. The rollup operator will also expose an API which users can access to broadcast layer 2 transactions and fetch the current state of the rollup.

Exact parameter for rollup size and/or rollup frequency TBD.

The rollup operator will be written in TypeScript because of easy access to SnarkyJS and proof production (arguably the most complex part of a zk-based rollup).

Additionally, the rollup operator will keep track of all transactions and account balanaces in a PostgreSQL database, allowing for more efficient querying. However, the off-chain storage plays the role of allowing trustless access to the rollup.

_TODO: Structure of transaction pool_

---

##### 2.2.3 Off-chain storage <span id="223"></span>

<img
     src="https://www.proxylabs.org/assets/img/off_chain_state.svg"
     style="margin-left: 30px; margin-right: 30px; width: 90%"/>

The off-chain state will keep track of account balances and transaction history, allowing the node operator to update it and update the merkle root on-chain.

Off-chain state will also serve as a fall back incase the data held by rollup operators gets lost. For data querying, the data held by rollup operators will be used.

There are a few hurdles associated with off-chain state, some of them will be explained in the last section.

For the proof of concet, data will remain on the operators machine (memory) but a off-chain and decentralized storage solution is the goal. (IPFS, Kyve, etc)

---

##### 2.2.4 Frontend <span id="224"></span>

<img
     src="https://www.proxylabs.org/assets/img/frontend.svg"
     style="margin-left: 30px; margin-right: 30px; height: 300px"/>

The frontend will serve as a basic user interface, allowing users to interact directly with the on-chain smart contract and the off-chain rollup layer. The frontend will integrate with a browser extension-based wallet (eg Auro).

The frontend will be written in VueJS, but should only be an example that demonstrates how to use the rollup.

### 3. Improvements <span id="3"></span>

The current architecture relies on a `centralised but trustless` system where rollup operators are producing batches in a centralized manner, while still allowing users to withdraw their funds in case of emergency or censorship. A potential improvement could be to decentralize rollup operations and transaction pools, so users don't rely on one single operator.

### 4. Security assumptions and potential problems <span id="4"></span>

- trustless and censorship resistant withdrawals

  Other zk-rollups, eg zkSync, rely on the layer 1 for security assumptions and the managment of funds. It is important to give the user a way of withdrawing their funds in case of censorship by the node operator. On Ethereum, a user can use the transaction history and the calldata associated with it to re-create the merkle and initate a withdrawl without relying on a rollup operator. On Mina, we throw away history - therefore we can't make security assumptions based on past transactions and need to find another way of allowing users to access essential data in a trustless and decentralized manner. For the sake of simplicity, the first iteration of the project will be based on off-chain storage within the rollup operators memory. For a production ready version, off-chain data needs to be trustless and decentralized - or find a new way of allowing turstless withdrawals.

- off-chain data corruption
  The functionality of the rollup relies on off-chain data (see above). It is important to not loose any data or corrupt it. I need to find a solution to store off-chain data in a trustless and decentralized manner.
- censorship resitance
  See above. A potential solution for that could be the idea proposed under <a href="#3">3. Improvements</a>

### 5. Summary <span id="5"></span>

Minas SnarkyJS makes it relatively easy to develop a rollup - both the proof production and the verification part are being handled by SnarkyJS and Mina directly - that allows developers to focus on the actual applcation while still gaining benefits of rollups.

### 6. References <span id="6"></span>

- https://vitalik.ca/general/2021/01/05/rollup.html
- https://docs.ethhub.io/ethereum-roadmap/layer-2-scaling/zk-rollups/
- https://coinyuppie.com/understand-zk-rollups-how-to-bring-a-paradigm-shift-in-the-crypto-ecosystem/
- https://www.defipulse.com/blog/a-beginners-guide-to-ethereum-scaling-solutions/
- https://medium.com/coinmonks/guide-to-ethereum-scaling-solutions-7ef55423f47e
- https://jsidhu.medium.com/the-ultimate-guide-to-rollups-f8c075571770
  https://zksync.io/dev/#overview
- https://explorer.hermez.io/
- https://docs.hermez.io/Hermez_1.0/about/scalability/
- https://docs.hermez.io/Hermez_1.0/about/scalability/#zero-knowledge-rollups

## Implementation

### 1. Off-chain Storage Structure <span id="impl_1"></span>

This section will go into detail on how off-chain state works.

#### 1.1 Merkle Tree <span id="impl_12"></span>

The Merkle Tree serves and an underlying structure composed of hashes. The following data storage implementations are a wrapper for a Merkle Tree and a storage structure like `Map<K, V>` or `Array<V>`.

This section will briefly explain how the Merkle Tree implementation works.

##### Merkle Tree Structure

The tree structure consists of mainly 4 parts: the underlying data, leaf nodes which are the hashes of the corresponding data, nodes, and the root. An example is shown below.

<img src="https://www.proxylabs.org/assets/img/merkle_tree_descriptors.svg" style="margin-top: 25px; margin-left: 10%; margin-right: 10%; width: 80%"/>
<p style="text-align: center;">Merkle Tree structure, odd leaves n = 5</p>

The `Data` section of the tree is mainly being represented by the two implemented data structures `KeyedDataStore<K, V>` and `DataStack<V>`, which basically represents well known TypeScript structures like `Map<K, V>` and `Array<V>`, respectively, but only with the addition of a Merkle Tree that uses those data structures as its "foundation" while allowing for easy construction and rebuilding of the Merkle Tree.

:::info  
For trees of odd size, like the one above, the remaining odd node **E** would simply be "handed over" to next level, without re-hasing it.
:::

##### Merkle Tree Proof/Path

The Merkle Path allows users and developers to proof the integrity of a piece of data by only providing a path that leads from a given piece of data to the Merkle root.

<img src="https://www.proxylabs.org/assets/img/merkle_path.svg" style="margin-top: 25px; margin-left: 15%; margin-right: 15%; width: 70%"/>
<p style="text-align: center;">Merkle Path</p>

If we wanted to efficiently proof the integritiy, or rather existance in our case, of <b style="color: red">**A**</b>, we would proceed the following way:

1. use a hashing algorithm (Poseidon in our case) on <b style="color: red">**A**</b> to get its corresponding hash <b style="color: red">**H<sub>A</sub>**</b>
2. get the hash of <b style="color: orange">**H<sub>B</sub>**</b>, concatenate both hashes and calculate the hash **H<sub>A,B</sub>**
3. get the hash of <b style="color: orange">**H<sub>C,D</sub>**</b>, concatenate <b style="color: orange">**H<sub>C,D</sub>**</b> with **H<sub>A,B</sub>** and calculate the hash of the concatenation
4. check if **H<sub>AB,CD</sub>** equals the on-chain root of the Merkle Tree

:::info  
The Merkle Tree, including all hashes and its root, would have to be available off-chain in a secure and decentralized place. For now, it is only available in the rollup operators memory.
:::

#### 1.2 In-Memory <span id="impl_12"></span>

##### KeyedDataStore<K, V extends CircuitValue>

Currently, there are two datastructures of data storage implemented - the first one is a `Map<K, V>`, called `KeyedDataStore<K, V extends CircuitValue>`. Note `V extends CircuitValue` - this is because the `value: V` needs to be hashable with Poseidon in order to construct a Poseidon-compatible Merkle Tree in SnarkyJS. In order to achieve that, all data of type `V` would need to extend SnarkyJS's `CircuitValue`.

Exact API of that class will follow, see [here](https://github.com/Trivo25/mina-zk-rollup/blob/main/src/snapp/datastore/KeyedDataStore.ts#L6) for the implementation.

##### DataStack<V extends CircuitValue>

Similiar to `KeyedDataStore`, `DataStack` is just a wrapper for a Merkle Tree and JavaScript's `Array<V>` structure. Just like values in `KeyedDataStore`, `V` must also extend `CircuitValue` to allow the Merkle Tree to hash the data.

Exact API of that class will follow, see [here](https://github.com/Trivo25/mina-zk-rollup/blob/main/src/snapp/datastore/MerkleTree.ts) for the implementation.

#### 1.3 IPFS <span id="impl_13"></span>

_For a first MVP, all data will not only be available within the rollup operators memory, but also on IPFS_

### 2. API and Interfaces <span id="impl_2"></span>

### 3. Off-chain Methods <span id="impl_3"></span>

Similiar to `KeyedDataStore`, `DataStack` is just a wrapper for a Merkle Tree and JavaScript's `Array<V>` structure. Just like values in `KeyedDataStore`, `V` must also extend `CircuitValue` to allow the Merkle Tree to hash the data.

Exact API of that class will follow, see [here](https://github.com/Trivo25/mina-zk-rollup/blob/main/src/snapp/datastore/MerkleTree.ts) for the implementation.

#### 1.3 IPFS <span id="impl_13"></span>

_For a first MVP, all data will not only be available within the rollup operators memory, but also on IPFS_

# TODOs

    - off-chain storage, atomic transactions
    - data models
    - smart contract structure
