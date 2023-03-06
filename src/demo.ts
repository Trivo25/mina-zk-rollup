import {
  AccountUpdate,
  isReady,
  SmartContract,
  method,
  Field,
  PrivateKey,
  Mina,
  Experimental,
  UInt64,
  Circuit,
  Bool,
  NetworkPrecondition,
} from 'snarkyjs';
import { Account } from './proof_system/account';
import {
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
  let u = AccountUpdate.create(zkappAddress);
  u.send({
    to: PrivateKey.random().toPublicKey(),
    amount: 10,
  });
  u.requireSignature();
});
await tx.sign([feePayerKey, zkappKey]);
let [p1] = await tx.prove();

class ContractProof extends MyContract.Proof() {}

let proof: ContractProof = ContractProof.fromJSON(p1!.toJSON())!;
proof.verify();

let update = tx.transaction.accountUpdates[0];

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

function verifyAccountUpdate(
  publicState: StateTransition,
  proof: ContractProof,
  accountUpdate: AccountUpdate,
  account: Account
) {
  const body = accountUpdate.body;

  // verify proof and check that the hash matches
  proof.verify();
  accountUpdate.hash().assertEquals(proof.publicInput.accountUpdate);

  // check that the public key and tokenid matches
  body.publicKey.assertEquals(account.publicKey);
  body.tokenId.assertEquals(account.tokenId);

  // check that the account has enough balance, if the account is supposed to transfer funds
  let balanceChangeValid = Circuit.if(
    body.balanceChange.sgn.isPositive(),
    Bool(true),
    account.balance.total.greaterThanOrEqual(body.balanceChange.magnitude)
  );
  balanceChangeValid.assertTrue('Not enough balance');

  // TODO: Events, will skip for now
  // TODO: Actions, will skip for now
  // TODO mayUseToken - not sure
  // TODO: callData - not sure
  // TODO: callDepth - not sure

  const accountPreconditions = body.preconditions.account;

  // i could use boolean algebra directly, but i would rather not to keep it readable
  // IF valus is set THEN check if preconditions matches ELSE throw
  Circuit.if(
    accountPreconditions.balance.isSome,
    accountPreconditions.balance.value.lower
      .lessThanOrEqual(account.balance.total)
      .and(
        accountPreconditions.balance.value.upper.greaterThanOrEqual(
          account.balance.total
        )
      ),
    Bool(true)
  ).assertTrue("Preconditions don't match - Balance!");

  Circuit.if(
    accountPreconditions.nonce.isSome,
    accountPreconditions.nonce.value.lower
      .lessThanOrEqual(account.nonce)
      .and(
        accountPreconditions.nonce.value.upper.greaterThanOrEqual(account.nonce)
      ),
    Bool(true)
  ).assertTrue("Preconditions don't match - Nonce!");

  Circuit.if(
    accountPreconditions.receiptChainHash.isSome,
    accountPreconditions.receiptChainHash.value.equals(
      account.receiptChainHash
    ),

    Bool(true)
  ).assertTrue("Preconditions don't match - receiptChainHash!");

  Circuit.if(
    accountPreconditions.delegate.isSome,
    accountPreconditions.delegate.value.equals(account.delegateAccount),
    Bool(true)
  ).assertTrue("Preconditions don't match - delegate!");

  let statePreconditions = Bool(true);
  for (let i = 0; i < 8; i++) {
    let p = accountPreconditions.state[i];
    let s = account.zkappState[i];
    statePreconditions = Circuit.if(
      p.isSome,
      p.value.equals(s.value),
      Bool(true)
    );
  }
  statePreconditions.assertTrue("Preconditions don't match - state!");

  // TODO: sequence state

  Circuit.if(
    accountPreconditions.provedState.isSome,
    accountPreconditions.provedState.value.equals(account.provedState),
    Bool(true)
  ).assertTrue("Preconditions don't match - provedState!");

  Circuit.if(
    accountPreconditions.isNew.isSome,
    accountPreconditions.isNew.value.equals(account.isNew),
    Bool(true)
  ).assertTrue("Preconditions don't match - isNew!");

  const networkPreconditions = body.preconditions.network;

  Circuit.if(
    networkPreconditions.snarkedLedgerHash.isSome,
    networkPreconditions.snarkedLedgerHash.value.equals(
      publicState.source.network.snarkedLedgerHash.value
    ),
    Bool(true)
  ).assertTrue("Preconditions don't match - provedState!");

  // TODO: valid while
}

const State = new RollupState({
  accountDbCommitment: Field(0),
  pendingDepositsCommitment: Field(0),
  network: NetworkState.empty(),
});

verifyAccountUpdate(
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
