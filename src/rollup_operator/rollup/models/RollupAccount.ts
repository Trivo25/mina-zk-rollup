import { CircuitValue, Field, prop, PublicKey, UInt32, UInt64 } from 'snarkyjs';
import {
  ISerializableField,
  IDeserializableField,
  IHashable,
} from '../../../lib/models';

/**
 * A {@link RollupAccount} describes an account on the layer 2.
 * It's structure is divided into an "essential" part, and an "non-essential" part.
 * The essential part includes the most important properties an account has in order for it to be verified, this encludes
 * `balance`, `nonce`, `publicKey` *soon more*
 * the non-essential part only includes some meta information or "nice-to-haves" like
 * `identifier` or `aliveSince`
 */
export default class RollupAccount
  extends CircuitValue
  implements ISerializableField, IDeserializableField<RollupAccount>, IHashable
{
  // essential properties
  @prop balance: UInt64;
  @prop nonce: UInt32;
  @prop publicKey: PublicKey;

  // non-essential properties
  identifier: string | undefined; // eg username "Wallet of *insert name here*"
  aliveSince: string | undefined; // time stamp

  constructor(balance: UInt64, publicKey: PublicKey, nonce: UInt32) {
    super();
    this.balance = balance;
    this.publicKey = publicKey;
    this.nonce = nonce;
  }
  getHash(): Field {
    throw new Error('Method not implemented.');
  }
  deserialize(xs: Field[]): RollupAccount {
    throw new Error('Method not implemented.');
  }
  serialize(): Field[] {
    throw new Error('Method not implemented.');
  }
}
