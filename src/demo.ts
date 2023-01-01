import {
  AccountUpdate,
  isReady,
  SmartContract,
  method,
  Field,
  PrivateKey,
  Mina,
} from 'snarkyjs';

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

tx = await Mina.transaction(feePayer, () => {
  AccountUpdate.fundNewAccount(feePayer);
  zkapp.deploy();
});
await tx.sign([feePayerKey, zkappKey]).send();

tx = await Mina.transaction(feePayer, () => {
  zkapp.update(Field(1));
});
await tx.sign([feePayerKey, zkappKey]);
let [p1] = await tx.prove();

let json = tx.transaction.accountUpdates[0].toJSON();
let update = AccountUpdate.fromJSON(json);
let pub = update.toPublicInput();
console.log(JSON.stringify(pub));
console.log(JSON.stringify(p1?.publicInput));
console.log(JSON.stringify(update.toJSON()) == JSON.stringify(json));
