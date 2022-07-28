import {
  isReady,
  PrivateKey,
  shutdown,
  UInt32,
  UInt64,
  ZkProgram,
} from 'snarkyjs';
import { RollupAccount, RollupStateTransition } from './';

import { MerkleTree, MerkleProof } from '../../lib/merkle_proof';

let MyProgram = ZkProgram({
  publicInput: RollupStateTransition,

  methods: {
    proveTransaction: {
      // eslint-disable-next-line no-undef
      privateInputs: [],

      method(stateTransition: RollupStateTransition) {
        /* RECEIVER and SENDER
        

        SENDER.merklePath == TRUE with hash
        RECEIVER.merklePath == TRUE with hash
        stateTransition.before == SENDER.merklePath.root

        -> both accounts are in the state root

        SENDER apply changes
        tempRoot = calc new merkle path
        
        RECEIVER.newMerklePath == tempRoot with hash -> is valid account
        RECEIVER apply changes

        -> calculate new merkle path based on RECEIVER

        stateTransition.after == RECEIVER.merklePath.root
        --> inductive!





        */
      },
    },
  },
});

await isReady;

let accounts = [];

for (let i = 0; i < 8; i++) {
  let privateKey = PrivateKey.random();
  accounts[i] = {
    privateKey: privateKey,
    account: new RollupAccount(
      UInt64.fromNumber(100),
      UInt32.fromNumber(0),
      PrivateKey.random().toPublicKey(),
      MerkleProof.fromElements([])
    ),
  };
}
let store = MerkleTree.fromDataLeaves(
  accounts.map((e: any) => e.account.getHash()),
  false
);

store.printTree();

console.log('merkle root', store.getMerkleRoot()?.toString());

const simulateTransition = (
  sender: RollupAccount,
  receiver: RollupAccount,
  amount: number,
  store: MerkleTree
) => {
  let preHash = sender.getHash().toString();
  sender.merkleProof = store.getProof(store.getIndex(sender.getHash())!)!;
  console.log('preHash ', preHash);
  console.log(
    'isValid? ',
    MerkleTree.validateProof(
      sender.merkleProof,
      sender.getHash(),
      store.getMerkleRoot()!
    )
  );

  console.log(sender.merkleProof.xs.length);

  //let tx = new RollupTransaction();
};

let tx = simulateTransition(
  accounts[0].account,
  accounts[1].account,
  50,
  store
);

await MyProgram.compile();

shutdown();
