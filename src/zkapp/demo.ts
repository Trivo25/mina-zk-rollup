import { isReady, Mina, PrivateKey, Field, UInt64, Party, Poseidon, Circuit, shutdown } from "snarkyjs";
import { MerkleTree } from "../lib/merkle_proof/MerkleTree";
import RollupZkApp from "./RollupZkApp";

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
    let snapp = new RollupZkApp(snappPubKey);

    const amount = UInt64.fromNumber(1000000);
    const p = await Party.createSigned(account2);
    p.balance.subInPlace(amount);
    let previousRoot = merkleTree.getMerkleRoot();

    if (previousRoot === undefined) {
      console.log('Merkel root undefined');
      previousRoot = Field(0);
    }

    snapp.deploy(amount, previousRoot, Field(0));
  })
    .send()
    .wait();

  // let snappState = (await Mina.getAccount(snappPubKey)).snapp.appState[0];
  // console.log('initial state: ' + snappState);

  await Mina.transaction(account1, async () => {
    let snapp = new RollupZkApp(snappPubKey);

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
