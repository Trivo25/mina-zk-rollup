import {
  arrayProp,
  CircuitValue,
  Field,
  Poseidon,
  PublicKey,
  Signature,
  UInt64,
} from 'snarkyjs';
import RollupDeposit from './RollupDeposit';

const DEPOSIT_QUEUE_SIZE = 5;

export default class Deposits extends CircuitValue {
  @arrayProp(RollupDeposit, DEPOSIT_QUEUE_SIZE) deposits!: RollupDeposit[];

  constructor(deposits: RollupDeposit[]) {
    super();
    let xs = [];
    for (let i = 0; i < DEPOSIT_QUEUE_SIZE; i++) {
      xs[i] = deposits[i] ?? dummyDeposit();
    }
    this.deposits = xs;
  }

  getHash() {
    let payload: Field[] = [];
    this.deposits.forEach((d) => payload.push(...d.toFields()));
    return Poseidon.hash(payload);
  }

  push(deposit: RollupDeposit) {
    if (this.deposits.length > DEPOSIT_QUEUE_SIZE)
      throw new Error('Batch full');
    let xs = [];
    let padded = false;
    for (let i = 0; i < DEPOSIT_QUEUE_SIZE; i++) {
      if (
        this.deposits[i].publicKey.equals(PublicKey.empty()).toBoolean() &&
        !padded
      ) {
        xs[i] = deposit;
        padded = true;
      }
    }
    this.deposits = xs;
  }

  pop() {
    for (let i = 0; i < DEPOSIT_QUEUE_SIZE; i++) {
      if (this.deposits[i].publicKey.equals(PublicKey.empty()).toBoolean()) {
        this.deposits[i - 1] = dummyDeposit();
      }
    }
  }
}

function dummyDeposit() {
  return new RollupDeposit(
    PublicKey.empty(),
    UInt64.from(0),
    UInt64.zero,
    Signature.fromJSON({
      r: '1',
      s: '1',
    })!
  );
}
