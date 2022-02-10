import {
  Bool,
  Circuit,
  Field,
  isReady,
  method,
  Mina,
  Party,
  Poseidon,
  PrivateKey,
  shutdown,
  SmartContract,
  State,
  state,
  UInt64,
} from 'snarkyjs';

import { MerkleTree, Tree } from './datastore/MerkleTree.js';

class MerkleSnapp extends SmartContract {
  @state(Field) merkleRoot = State<Field>();

  deploy(initialBalance: UInt64, merkleRoot: Field) {
    super.deploy();
    this.balance.addInPlace(initialBalance);
    this.merkleRoot.set(merkleRoot);
  }

  @method async validateProof(merklePath: any, leafHash: Field): Promise<Bool> {
    // merkle root from inside the smart contract
    let merkleRoot = await this.merkleRoot.get();

    // ! 'if' is probably not good here?
    if (merklePath.length === 0) {
      return leafHash.equals(merkleRoot);
    }

    var proofHash: Field = leafHash;
    for (let x = 0; x < merklePath.length; x++) {
      proofHash = Circuit.if(
        merklePath[x].direction.equals(Field(0)),
        Poseidon.hash([merklePath[x].hash, proofHash]),
        proofHash
      );
      proofHash = Circuit.if(
        merklePath[x].direction.equals(Field(1)),
        Poseidon.hash([proofHash, merklePath[x].hash]),
        proofHash
      );
    }

    return proofHash.equals(merkleRoot);
  }
}

test();

async function test() {
  await isReady;

  const Local = Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);

  const account1 = Local.testAccounts[0].privateKey;
  const account2 = Local.testAccounts[1].privateKey;

  const snappPrivKey = PrivateKey.random();
  const snappPubKey = snappPrivKey.toPublicKey();

  // creating a new merkle'ized off chain storage

  // let leaves: Field[] = [Field(0), Field(1), Field(2), Field(3), Field(4)];

  // having some more data
  let leaves: Field[] = [];
  for (let i = 0; i < 100; i++) {
    leaves.push(Field(Math.floor(Math.random() * 1000)));
  }

  let merkleTree: MerkleTree = new MerkleTree();
  merkleTree.addLeaves(leaves);

  await Mina.transaction(account1, async () => {
    let snapp = new MerkleSnapp(snappPubKey);

    const amount = UInt64.fromNumber(1000000);
    const p = await Party.createSigned(account2);
    p.balance.subInPlace(amount);
    let previousRoot = merkleTree.getMerkleRoot();

    if (previousRoot === undefined) {
      console.log('Merkel root undefined');
      previousRoot = Field(0);
    }

    snapp.deploy(amount, previousRoot);
  })
    .send()
    .wait();

  // let snappState = (await Mina.getAccount(snappPubKey)).snapp.appState[0];
  // console.log('initial state: ' + snappState);

  await Mina.transaction(account1, async () => {
    let snapp = new MerkleSnapp(snappPubKey);

    // make the contract verify every leaf inside the original leaves array
    leaves.forEach(async (leaf, i) => {
      let res = await snapp.validateProof(
        merkleTree.getProof(i),
        Poseidon.hash([leaf])
      );

      Circuit.asProver(() => {
        console.log(`existance of ${leaf.toString()}`, res.toBoolean());
      });
    });
  })
    .send()
    .wait();

  // snappState = (await Mina.getAccount(snappPubKey)).snapp.appState[0];
  // console.log('final state: ' + snappState);

  shutdown();
}
