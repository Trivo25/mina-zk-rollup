import {
  AccountUpdate,
  isReady,
  SmartContract,
  method,
  Field,
  PrivateKey,
  Mina,
  Proof,
  UInt64,
  Permission,
  ZkappPublicInput,
} from 'snarkyjs';
import { Account } from './proof_system/account';
import {
  getVerifier,
  NetworkState,
  RollupState,
  StateTransition,
} from './proof_system/state_transition';

await isReady;

class MyContract extends SmartContract {
  @method update(x: Field) {
    x.assertEquals(1);
  }
}

await MyContract.compile();

let Local = Mina.LocalBlockchain();
Mina.setActiveInstance(Local);

function RollupClient({
  sequencer,
  mina,
}: {
  sequencer: string;
  mina: string;
}) {
  return {
    Network: Mina.Network(mina),
    sendTx: async (
      tx: Mina.Transaction,
      proofs: (Proof<ZkappPublicInput> | undefined)[]
    ) => {},
  };
}

let feePayerKey = Local.testAccounts[0].privateKey;
let feePayer = Local.testAccounts[0].publicKey;
let zkappKey = PrivateKey.random();
let zkappAddress = zkappKey.toPublicKey();

let zkapp = new MyContract(zkappAddress);
let tx;
console.log('compiling');
tx = await Mina.transaction(feePayer, () => {
  AccountUpdate.fundNewAccount(feePayer);
  zkapp.deploy();
});
await tx.sign([feePayerKey, zkappKey]).send();

tx = await Mina.transaction(feePayer, () => {
  zkapp.update(Field(1));
});
await tx.sign([feePayerKey, zkappKey]);
let pis = await tx.prove();
let [p1] = pis;
console.log(p1?.toJSON());
class ContractProof extends MyContract.Proof() {}

let proof: ContractProof = ContractProof.fromJSON(p1!.toJSON())!;
proof.verify();

let update = tx.transaction.accountUpdates[0];

let { Network, sendTx } = RollupClient({
  sequencer: '',
  mina: '',
});

await sendTx(tx, pis);

/* const RollupProver = Experimental.ZkProgram({
  publicInput: Field,

  methods: {
    proveAccountUpdateProof: {
      privateInputs: [ContractProof, AccountUpdate, Account],
      // @ts-ignore
      method(
        publicInput: Field,
        proof: ContractProof,
        accountUpdate: AccountUpdate,
        account: Account
      ) {
        proof.verify();
        accountUpdate.hash().assertEquals(proof.publicInput.accountUpdate);

        let balanceIsValid = Circuit.if(
          accountUpdate.body.balanceChange.sgn.isPositive(),
          Bool(true),
          account.balance.total.greaterThanOrEqual(
            accountUpdate.body.balanceChange.magnitude
          )
        );
        balanceIsValid.assertTrue('Not enough balance');
      },
    },
  },
});

await RollupProver.compile(); */
let acc = Account.empty();
acc.publicKey = update.body.publicKey;
acc.tokenId = update.body.tokenId;
acc.balance.total = UInt64.from(500);
acc.permissions.editState = Permission.proof();
const State = new RollupState({
  accountDbCommitment: Field(0),
  pendingDepositsCommitment: Field(0),
  network: NetworkState.empty(),
});

console.log('verifier');
const verifier = getVerifier(MyContract);
verifier(
  new StateTransition({ source: State, target: State }),
  proof,
  update,
  acc
);
//await RollupProver.proveAccountUpdateProof(Field(0), proof, update, acc);

/* 
let json = tx.transaction.accountUpdates[0].toJSON();
let update = AccountUpdate.fromJSON(json);
let pub = update.toPublicInput();
console.log(JSON.stringify(pub));
console.log(JSON.stringify(p1?.publicInput));
console.log(JSON.stringify(update.toJSON()) == JSON.stringify(json));
 */
