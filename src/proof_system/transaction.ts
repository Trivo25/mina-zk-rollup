import {
  Struct,
  PublicKey,
  Field,
  UInt64,
  Bool,
  UInt32,
  Signature,
  CircuitValue,
  prop,
  Poseidon,
  PrivateKey,
  arrayProp,
} from 'snarkyjs';
import { AccountWitness } from '../lib/data_store/AccountStore';
import { DepositWitness } from '../lib/data_store/DepositStore';
import { base58Encode } from '../lib/helpers/base58';
import { EnumFinality, ITransaction, IDeposit } from '../lib/models';
import { Account } from './account.js';

export {
  AccountUpdate_,
  Transaction,
  RollupTransaction,
  dummyAccount,
  TransactionBatch,
  RollupDeposit,
};

class AccountUpdate_ extends Struct({}) {
  apply(account: Field): Field {
    return account;
  }
}

class Transaction extends Struct({
  feePayer: {
    body: {
      publicKey: PublicKey,
      fee: UInt64,
      validUntil: {
        isSome: Bool,
        value: UInt32,
      },
      nonce: UInt32,
    },
    authorization: String,
  },
  accountUpdates: [
    AccountUpdate_,
    AccountUpdate_,
    AccountUpdate_,
    AccountUpdate_,
  ],
}) {
  verifyAll() {}
}

/**
 * A {@link RollupTransaction} describes the transactions that take place on the layer 2.
 */

class RollupTransaction extends CircuitValue {
  @prop amount: UInt64;
  @prop nonce: UInt32;
  @prop sender: Account;
  @prop receiver: Account;
  @prop tokenId: Field;
  @prop signature: Signature;

  @prop to: PublicKey;
  @prop from: PublicKey;

  state: EnumFinality = EnumFinality.PENDING;
  type: string = 'TRANSFER';
  constructor(
    amount: UInt64,
    nonce: UInt32,
    from: PublicKey,
    to: PublicKey,
    tokenId: Field,
    signature: Signature,
    sender: Account,
    receiver: Account
  ) {
    super(amount, nonce, to, from, tokenId, signature, sender, receiver);
    this.amount = amount;
    this.nonce = nonce;
    this.from = from;
    this.to = to;
    this.tokenId = tokenId;
    this.signature = signature;
    this.sender = sender;
    this.receiver = receiver;
  }

  static from(
    amount: UInt64,
    nonce: UInt32,
    from: PublicKey,
    to: PublicKey,
    tokenId: Field,
    signature: Signature
  ): RollupTransaction {
    return new RollupTransaction(
      amount,
      nonce,
      from,
      to,
      tokenId,
      signature,
      dummyAccount(),
      dummyAccount()
    );
  }

  toFields(): Field[] {
    // I specify custom toField methods because some elements don't need to be includes
    // e.g. we don't want to hash the sender and receiver account, only the pubKeys
    return this.amount
      .toFields()
      .concat(this.nonce.toFields())
      .concat(this.to.toFields())
      .concat(this.from.toFields())
      .concat(this.tokenId.toFields());
  }

  getHash(): Field {
    return Poseidon.hash(this.toFields());
  }

  getBase58Hash(): string {
    return base58Encode(this.getHash().toString());
  }

  static fromInterface(tx: ITransaction): RollupTransaction {
    try {
      return RollupTransaction.from(
        UInt64.from(tx.amount),
        UInt32.from(tx.nonce),
        PublicKey.fromBase58(tx.from),
        PublicKey.fromBase58(tx.to),
        Field(tx.tokenId),
        Signature.fromJSON(tx.signature)!
      );
    } catch (error: any) {
      throw new Error(
        `Cannot construct ${this.name} from invalid interface. ${error.message}`
      );
    }
  }

  toInterface(): ITransaction {
    return {
      from: this.from.toBase58(),
      to: this.to.toBase58(),
      amount: this.amount.toString(),
      nonce: this.nonce.toString(),
      tokenId: this.tokenId.toString(),
      signature: {
        r: this.signature.r.toString(),
        s: this.signature.s.toJSON()?.toString()!,
      },
    };
  }

  sign(priv: PrivateKey) {
    this.signature = Signature.create(priv, this.toFields());
  }
}

const dummyAccount = (): Account => {
  return new Account(
    UInt64.from(0),
    UInt32.from(0),
    PrivateKey.random().toPublicKey(),
    AccountWitness.empty()
  );
};

const BATCH_SIZE = 1;

class TransactionBatch extends CircuitValue {
  @arrayProp(RollupTransaction, BATCH_SIZE)
  xs!: RollupTransaction[];

  static batchSize = BATCH_SIZE;

  constructor(xs: RollupTransaction[]) {
    super(xs);
  }

  static fromElements(xs: RollupTransaction[]): TransactionBatch {
    if (xs.length !== BATCH_SIZE) {
      throw Error(
        `Can only process exactly ${BATCH_SIZE} transactions in one batch.`
      );
    }
    return new TransactionBatch(xs);
  }
}
class RollupDeposit extends CircuitValue {
  @prop publicKey: PublicKey;
  @prop to: PublicKey;
  @prop amount: UInt64;
  @prop tokenId: Field;
  @prop signature: Signature;

  @prop leafIndex: Field;
  @prop merkleProof: DepositWitness;

  @prop target: Account;

  constructor(
    publicKey: PublicKey,
    to: PublicKey,
    amount: UInt64,
    tokenId: Field,
    signature: Signature,
    leafIndex: Field,
    merkleProof: DepositWitness,
    target: Account
  ) {
    super(publicKey, to, amount, tokenId, signature, merkleProof, target);
    this.publicKey = publicKey;
    this.to = to;
    this.amount = amount;
    this.tokenId = tokenId;
    this.signature = signature;
    this.leafIndex = leafIndex;
    this.merkleProof = merkleProof;
    this.target = target;
  }

  toFields(): Field[] {
    return this.amount
      .toFields()
      .concat(this.publicKey.toFields())
      .concat(this.to.toFields())
      .concat(this.tokenId.toFields())
      .concat(this.leafIndex.toFields());
  }

  getHash(): Field {
    return Poseidon.hash(this.toFields());
  }

  getBase58Hash(): string {
    return base58Encode(this.getHash().toString());
  }

  static from(
    publicKey: PublicKey,
    to: PublicKey,
    amount: UInt64,
    tokenId: Field,
    signature: Signature,
    leafIndex: Field,
    merkleProof: DepositWitness,
    target: Account
  ) {
    return new RollupDeposit(
      publicKey,
      to,
      amount,
      tokenId,
      signature,
      leafIndex,
      merkleProof,
      target
    );
  }

  static fromInterface(d: IDeposit): RollupDeposit {
    try {
      return RollupDeposit.from(
        PublicKey.fromBase58(d.publicKey),
        PublicKey.fromBase58(d.to),
        UInt64.from(d.amount),
        Field(d.tokenId),
        Signature.fromJSON(d.signature)!,
        Field(d.index),
        DepositWitness.empty(),
        Account.empty()
      );
    } catch (error: any) {
      throw new Error(
        `Cannot construct ${this.name} from invalid interface. ${error.message}`
      );
    }
  }
}
