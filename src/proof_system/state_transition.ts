import { Bool, Field, Poseidon, Struct, UInt32, UInt64 } from 'snarkyjs';
export { StateTransition, RollupState, NetworkState };

const DefaultUInt32 = {
  isSome: Bool(false),
  value: {
    lower: UInt32.from(0),
    upper: UInt32.from(0),
  },
};

const DefaultUInt64 = {
  isSome: Bool(false),
  value: {
    lower: UInt64.from(0),
    upper: UInt64.from(0),
  },
};

const DefaultField = {
  isSome: Bool(false),
  value: Field(0),
};

const EpochDefault = {
  epochLength: DefaultUInt32,
  ledger: {
    hash: DefaultField,
    totalCurrency: DefaultUInt64,
  },
  lockCheckpoint: DefaultField,
  seed: DefaultField,
  startCheckpoint: DefaultField,
};
class NetworkState extends Struct({
  
    snarkedLedgerHash: { isSome: Bool, value: Field },
    blockchainLength: {
      isSome: Bool,
      value: {
        lower: UInt32,
        upper: UInt32,
      },
    },
    minWindowDensity: {
      isSome: Bool,
      value: {
        lower: UInt32,
        upper: UInt32,
      },
    },
    totalCurrency: {
      isSome: Bool,
      value: {
        lower: UInt64,
        upper: UInt64,
      },
    },
    globalSlotSinceGenesis: {
      isSome: Bool,
      value: {
        lower: UInt32,
        upper: UInt32,
      },
    },
    stakingEpochData: {
      ledger: {
        hash: { isSome: Bool, value: Field },
        totalCurrency: {
          isSome: Bool,
          value: {
            lower: UInt64,
            upper: UInt64,
          },
        },
      },
      seed: { isSome: Bool, value: Field },
      startCheckpoint: { isSome: Bool, value: Field },
      lockCheckpoint: { isSome: Bool, value: Field },
      epochLength: {
        isSome: Bool,
        value: {
          lower: UInt32,
          upper: UInt32,
        },
      },
    },
    nextEpochData: {
      ledger: {
        hash: { isSome: Bool, value: Field },
        totalCurrency: {
          isSome: Bool,
          value: {
            lower: UInt64,
            upper: UInt64,
          },
        },
      },
      seed: { isSome: Bool, value: Field },
      startCheckpoint: { isSome: Bool, value: Field },
      lockCheckpoint: { isSome: Bool, value: Field },
      epochLength: {
        isSome: Bool,
        value: {
          lower: UInt32,
          upper: UInt32,
        },
      },
    },,
}) {
  static empty() {
    return new NetworkState({
      globalSlotSinceGenesis: DefaultUInt32,
      snarkedLedgerHash: DefaultField,
      nextEpochData: EpochDefault,
      stakingEpochData: EpochDefault,
      blockchainLength: DefaultUInt32,
      minWindowDensity: DefaultUInt32,
      totalCurrency: DefaultUInt64,
    });
  }
}

class RollupState extends Struct({
  pendingDepositsCommitment: Field,
  accountDbCommitment: Field,
  network: NetworkState,
}) {
  static hash(s: RollupState): Field {
    return Poseidon.hash(RollupState.toFields(s));
  }

  hash(): Field {
    return RollupState.hash(this);
  }
}

/**
 * A {@link RollupStateTransition} descibes the transition that takes place when
 * the rollup operator updates the current state of the the layer 2 by providing a series of
 * proofs that attest correct execution of transactions.
 */
class StateTransition extends Struct({
  source: RollupState,
  target: RollupState,
}) {
  static hash(s: StateTransition): Field {
    return Poseidon.hash(StateTransition.toFields(s));
  }

  hash(): Field {
    return StateTransition.hash(this);
  }
}
