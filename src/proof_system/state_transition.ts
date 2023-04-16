import {
  AccountUpdate,
  Bool,
  Circuit,
  Field,
  Poseidon,
  SmartContract,
  Struct,
  UInt32,
  UInt64,
} from 'snarkyjs';
import { Account } from './account';

export { StateTransition, RollupState, NetworkState, getVerifier };

const EpochDefault = {
  epochLength: UInt32.from(0),
  ledger: {
    hash: Field(0),
    totalCurrency: UInt64.from(0),
  },
  lockCheckpoint: Field(0),
  seed: Field(0),
  startCheckpoint: Field(0),
};
class NetworkState extends Struct({
  snarkedLedgerHash: Field,
  blockchainLength: UInt32,
  minWindowDensity: UInt32,
  totalCurrency: UInt64,
  globalSlotSinceGenesis: UInt32,
  stakingEpochData: {
    ledger: {
      hash: Field,
      totalCurrency: UInt64,
    },
    seed: Field,
    startCheckpoint: Field,
    lockCheckpoint: Field,
    epochLength: UInt32,
  },
  nextEpochData: {
    ledger: {
      hash: Field,
      totalCurrency: UInt64,
    },
    seed: Field,
    startCheckpoint: Field,
    lockCheckpoint: Field,
    epochLength: UInt32,
  },
}) {
  static empty() {
    return new NetworkState({
      globalSlotSinceGenesis: UInt32.from(0),
      snarkedLedgerHash: Field(0),
      nextEpochData: EpochDefault,
      stakingEpochData: EpochDefault,
      blockchainLength: UInt32.from(0),
      minWindowDensity: UInt32.from(0),
      totalCurrency: UInt64.from(0),
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
  class ContractProof extends Contract.Proof() {}

  return function verifyAccountUpdate(
    publicState: StateTransition,
    proof: ContractProof,
    accountUpdate: AccountUpdate,
    account: Account
  ) {
    const body = accountUpdate.body;
    console.log(1);
    // verify proof and check that the hash matches
    proof.verify();
    accountUpdate.hash().assertEquals(proof.publicInput.accountUpdate);
    console.log(2);

    // check that the public key and tokenid matches
    body.publicKey.assertEquals(account.publicKey);
    body.tokenId.assertEquals(account.tokenId);
    console.log(3);

    // check that the account has enough balance, if the account is supposed to transfer funds
    let balanceChangeValid = Circuit.if(
      body.balanceChange.sgn.isPositive(),
      Bool(true),
      account.balance.total.greaterThanOrEqual(body.balanceChange.magnitude)
    );

    balanceChangeValid.assertTrue('Not enough balance');

    // TODO: Events, will skip for now
    // TODO: Actions, will skip for now
    // TODO: mayUseToken - not sure
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
          accountPreconditions.nonce.value.upper.greaterThanOrEqual(
            account.nonce
          )
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
        publicState.source.network.snarkedLedgerHash
      ),
      Bool(true)
    ).assertTrue("Preconditions don't match - snarkedLedgerHash!");

    Circuit.if(
      networkPreconditions.blockchainLength.isSome,
      networkPreconditions.blockchainLength.value.lower
        .greaterThanOrEqual(publicState.source.network.blockchainLength)
        .and(
          networkPreconditions.blockchainLength.value.upper.lessThanOrEqual(
            publicState.source.network.blockchainLength
          )
        ),
      Bool(true)
    ).assertTrue("Preconditions don't match - blockchainLength!");

    Circuit.if(
      networkPreconditions.minWindowDensity.isSome,
      networkPreconditions.minWindowDensity.value.lower
        .greaterThanOrEqual(publicState.source.network.minWindowDensity)
        .and(
          networkPreconditions.minWindowDensity.value.upper.lessThanOrEqual(
            publicState.source.network.minWindowDensity
          )
        ),
      Bool(true)
    ).assertTrue("Preconditions don't match - minWindowDensity!");

    Circuit.if(
      networkPreconditions.totalCurrency.isSome,
      networkPreconditions.totalCurrency.value.lower
        .greaterThanOrEqual(publicState.source.network.totalCurrency)
        .and(
          networkPreconditions.totalCurrency.value.upper.lessThanOrEqual(
            publicState.source.network.totalCurrency
          )
        ),
      Bool(true)
    ).assertTrue("Preconditions don't match - totalCurrency!");

    // TODO remaining precondition checks
    // TODO: valid while

    //checking permissions

    // TODO: abstract
    let stateChange = Bool(false);
    for (let i = 0; i < 8; i++) {
      let p = body.update.appState[i];
      stateChange = stateChange.or(p.isSome);
    }

    // TODO: verify pseudo dynamically what type of auth is given
    const authIsProof = Bool(true);
    isTypeProof(account.permissions.editState).assertEquals(
      authIsProof,
      'Authorization is of type proofm but AccountUpdate had different authorization'
    );

    isTypeImpossible(account.permissions.editState).assertFalse(
      'Authorization is impossible'
    );

    // TODO: continue
  };
}

function isTypeProofOrSignature({
  constant,
  signatureNecessary,
  signatureSufficient,
}: {
  constant: Bool;
  signatureNecessary: Bool;
  signatureSufficient: Bool;
}) {
  return constant.not().and(signatureNecessary.not()).and(signatureSufficient);
}

function isTypeImpossible({
  constant,
  signatureNecessary,
  signatureSufficient,
}: {
  constant: Bool;
  signatureNecessary: Bool;
  signatureSufficient: Bool;
}) {
  return constant.and(signatureNecessary).and(signatureSufficient.not());
}

function isTypeSignature({
  constant,
  signatureNecessary,
  signatureSufficient,
}: {
  constant: Bool;
  signatureNecessary: Bool;
  signatureSufficient: Bool;
}) {
  return constant.not().and(signatureNecessary).and(signatureSufficient);
}

function isTypeProof({
  constant,
  signatureNecessary,
  signatureSufficient,
}: {
  constant: Bool;
  signatureNecessary: Bool;
  signatureSufficient: Bool;
}) {
  return constant
    .not()
    .and(signatureNecessary.not())
    .and(signatureSufficient.not());
}
