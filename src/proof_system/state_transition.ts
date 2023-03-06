import {  AccountUpdate, Bool, Circuit, Field, Poseidon, SmartContract, Struct, UInt32, UInt64 } from 'snarkyjs';
import { Account } from './account';

export { StateTransition, RollupState, NetworkState, getVerifier };

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


function getVerifier(Contract: typeof SmartContract) {
  class ContractProof extends Contract.Proof() {};

  return function verifyAccountUpdate(
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
}