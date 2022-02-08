import {
  Bool,
  Field,
  isReady,
  method,
  Mina,
  Party,
  Poseidon,
  PrivateKey,
  SmartContract,
  State,
  state,
  UInt64,
} from 'snarkyjs';

class MerkleSnapp extends SmartContract {
  @state(Field) x = State<Field>();

  deploy(initialBalance: UInt64, x: Field) {
    super.deploy();
    this.balance.addInPlace(initialBalance);
    this.x.set(x);
  }

  @method async validateProof(
    merklePath: any,
    leafHash: Field,
    merkleRoot: Field
  ): Promise<Bool> {
    // ! TODO: re write proof validation in a circuit compatibile way

    if (merklePath.length === 0) {
      return leafHash.equals(merkleRoot); // no siblings, single item tree, so the hash should also be the root
    }
    var proofHash: Field = leafHash;
    for (let x = 0; x < merklePath.length; x++) {
      if (merklePath[x].left) {
        // then the sibling is a left node
        proofHash = Poseidon.hash([merklePath[x].left, proofHash]);
      } else if (merklePath[x].right) {
        // then the sibling is a right node
        proofHash = Poseidon.hash([proofHash, merklePath[x].right]);
      } else {
        // no left or right designation exists, merklePath is invalid
        return Bool(false);
      }
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

  await Mina.transaction(account1, async () => {
    let snapp = new MerkleSnapp(snappPubKey);

    const amount = UInt64.fromNumber(1000000);
    const p = await Party.createSigned(account2);
    p.balance.subInPlace(amount);

    snapp.deploy(amount, Field(1));
  })
    .send()
    .wait();

  let snappState = (await Mina.getAccount(snappPubKey)).snapp.appState[0];
  console.log('initial state: ' + snappState);

  await Mina.transaction(account1, async () => {
    let snapp = new MerkleSnapp(snappPubKey);
    // await snapp.update(Field(3));
  })
    .send()
    .wait();

  snappState = (await Mina.getAccount(snappPubKey)).snapp.appState[0];
  console.log('final state: ' + snappState);
}
