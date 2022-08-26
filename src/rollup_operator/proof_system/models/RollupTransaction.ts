import {
  CircuitValue,
  Field,
  Poseidon,
  PrivateKey,
  prop,
  PublicKey,
  Signature,
  UInt32,
  UInt64,
} from 'snarkyjs';
import { base58Encode } from '../../../lib/helpers';
import { RollupAccount } from '../.';
import { EnumFinality, ITransaction } from '../../../lib/models';
import { AccountMerkleProof } from '../../../lib/merkle_proof';

/**
 * A {@link RollupTransaction} describes the transactions that take place on the layer 2.
 */

export default class RollupTransaction extends CircuitValue {
  @prop amount: UInt64;
  @prop nonce: UInt32;
  @prop sender: RollupAccount;
  @prop receiver: RollupAccount;
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
    sender: RollupAccount,
    receiver: RollupAccount
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
        UInt64.fromString(tx.amount),
        UInt32.fromString(tx.nonce),
        PublicKey.fromBase58(tx.from),
        PublicKey.fromBase58(tx.to),
        Field.fromString(tx.tokenId),
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

const dummyAccount = (): RollupAccount => {
  return new RollupAccount(
    UInt64.from(0),
    UInt32.from(0),
    PrivateKey.random().toPublicKey(),
    AccountMerkleProof.empty()
  );
};
