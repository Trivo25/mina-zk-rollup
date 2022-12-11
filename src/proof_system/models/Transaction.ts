import { Sign } from 'crypto';
import {
  Struct,
  PublicKey,
  Field,
  UInt64,
  Bool,
  UInt32,
  Signature,
  Proof,
  ZkappPublicInput,
} from 'snarkyjs';

class AccountUpdate_ extends Struct({
  body: {
    publicKey: PublicKey,
    tokendId: Field,
    update: Field,
    balanceChange: {
      magnitude: UInt64,
      sign: Sign,
    },
    incrementNonce: Bool,
    events: [],
    sequenceEvents: [],
    callData: Field,
    callDepth: Field,
    preconditions: {
      network: {
        snarkedLedgerHash: {
          isSome: Bool,
          value: Field,
        },
        timestamp: {
          isSome: Bool,
          value: UInt32,
        },
        blockchainLength: {
          isSome: Bool,
          value: UInt64,
        },
        minWindowDensity: {
          isSome: Bool,
          value: UInt64,
        },
        totalCurrency: {
          isSome: Bool,
          value: UInt64,
        },
        globalSlotSinceHardfork: {
          isSome: Bool,
          value: UInt64,
        },
        globalSlotSinceGenesis: {
          isSome: Bool,
          value: UInt64,
        },
        stakingEpochData: {
          ledger: {
            hash: {
              isSome: Bool,
              value: Field,
            },
            totalCurrency: {
              isSome: Bool,
              value: UInt64,
            },
          },
          seed: {
            isSome: Bool,
            value: Field,
          },
          startCheckpoint: {
            isSome: Bool,
            value: UInt64,
          },
          lockCheckpoint: {
            isSome: Bool,
            value: UInt64,
          },
          epochLength: {
            isSome: Bool,
            value: UInt64,
          },
        },
        nextEpochData: {
          ledger: {
            hash: {
              isSome: Bool,
              value: Field,
            },
            totalCurrency: {
              isSome: Bool,
              value: UInt64,
            },
          },
          seed: {
            isSome: Bool,
            value: Field,
          },
          startCheckpoint: {
            isSome: Bool,
            value: UInt64,
          },
          lockCheckpoint: {
            isSome: Bool,
            value: UInt64,
          },
          epochLength: {
            isSome: Bool,
            value: UInt64,
          },
        },
        account: {
          balance: {
            isSome: Bool,
            value: UInt64,
          },
          nonce: {
            lower: {
              isSome: Bool,
              value: UInt64,
            },
            upper: {
              isSome: Bool,
              value: UInt64,
            },
          },
          receiptChainHash: {
            isSome: Bool,
            value: UInt64,
          },
          delegate: {
            isSome: Bool,
            value: UInt64,
          },
          state: [
            {
              isSome: Bool,
              value: Field,
            },
            {
              isSome: Bool,
              value: Field,
            },
            {
              isSome: Bool,
              value: Field,
            },
            {
              isSome: Bool,
              value: Field,
            },
            {
              isSome: Bool,
              value: Field,
            },
            {
              isSome: Bool,
              value: Field,
            },
            {
              isSome: Bool,
              value: Field,
            },
            {
              isSome: Bool,
              value: Field,
            },
          ],
          sequenceState: {
            isSome: Bool,
            value: Field,
          },
          provedState: {
            isSome: Bool,
            value: Field,
          },
          isNew: {
            isSome: Bool,
            value: Field,
          },
        },
        useFullCommitment: Bool,
        caller: PublicKey,
      },
    },
  },
  authorization: {
    signature: {
      isSome: Bool,
      value: Signature,
    },
    proof: {
      isSome: Bool,
      value: Proof<ZkappPublicInput>,
    },
  },
}) {
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
