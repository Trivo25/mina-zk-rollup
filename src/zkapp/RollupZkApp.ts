import {
  Bool,
  Circuit,
  Field,
  method,
  Poseidon,
  PublicKey,
  Signature,
  SmartContract,
  State,
  state,
  UInt64,
} from 'snarkyjs';

import { DataStack } from '../lib/data_store';
import RollupAccount from '../rollup_operator/rollup/models/RollupAccount';
import RollupDeposit from '../rollup_operator/rollup/models/RollupDeposit';
import RollupProof from '../rollup_operator/rollup/RollupProof';

export default class RollupZkApp extends SmartContract {
  // Merkle root of all accounts
  @state(Field) acccountsCommitment = State<Field>();
  // Merkle root of all pending deposits
  @state(Field) pendingDepositsCommitment = State<Field>();

  deploy(
    initialBalance: UInt64,
    acccountsCommitment: Field,
    pendingDepositsCommitment: Field
  ) {
    super.deploy();
    this.balance.addInPlace(initialBalance);
    this.acccountsCommitment.set(acccountsCommitment);
    this.pendingDepositsCommitment.set(pendingDepositsCommitment);
  }

  @method async withdrawTo(
    rollupWithdrawal: RollupAccount,
    hashmerklePath: any,
    leafHash: Field,
    signature: Signature
  ) {
    // TODO: withdraw to initial account
  }

  @method async deposit(depositor: PublicKey, amount: UInt64) {
    let deposit = new RollupDeposit(depositor, amount);

    this.emitEvent(deposit);

    const oldCommitment = await this.pendingDepositsCommitment.get();
    const newCommitment = DataStack.getCommitment(deposit, oldCommitment);
    this.pendingDepositsCommitment.set(newCommitment);
  }

  @method async withdrawPendingDeposit(
    depositor: PublicKey,
    originalAmount: UInt64,
    path: Field[]
  ) {
    let deposit: RollupDeposit = new RollupDeposit(depositor, originalAmount);

    let originalCommitment: Field = await this.pendingDepositsCommitment.get();
    let currentDepositCommitment: Field = originalCommitment;

    for (let i = 0; i < path.length; i++) {
      currentDepositCommitment = DataStack.getCommitment(
        deposit,
        currentDepositCommitment
      );
    }

    currentDepositCommitment.assertEquals(originalCommitment);

    // TODO: return funds to depositor
    // TODO: update commitment - maybe introduce RollupPendingWithdrawal or something like that
  }

  @method async validateRollupProof(
    rollupProof: RollupProof,
    operator: PublicKey,
    operatorSignature: Signature
  ) {
    // TODO: checking if operator is within list of allowed operators
    // TODO: verify signature

    let acccountsCommitmentBefore = await this.acccountsCommitment.get();

    rollupProof.publicInput.source.accountDbCommitment.equals(
      acccountsCommitmentBefore
    );
  }

  @method async validateProof(merklePath: any, leafHash: Field): Promise<Bool> {
    // merkle root from inside the smart contract
    let currentAcccountsCommitment: Field =
      await this.acccountsCommitment.get();

    var proofHash: Field = leafHash;
    for (let x = 0; x < merklePath.length; x++) {
      proofHash = Circuit.if(
        merklePath[x].direction.equals(Field(0)),
        Poseidon.hash([merklePath[x].hash, proofHash]),
        proofHash
      );
      proofHash = Circuit.if(
        merklePath[x].direction.equals(Field(1)),
        Poseidon.hash([proofHash, merklePath[x].hash]),
        proofHash
      );
    }

    return proofHash.equals(currentAcccountsCommitment);
  }
}
