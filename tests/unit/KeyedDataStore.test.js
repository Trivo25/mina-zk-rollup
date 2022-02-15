var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { assert } from 'chai';
import { before, describe, it } from 'mocha';
import { CircuitValue, Field, isReady, Poseidon, PrivateKey, prop, shutdown, UInt64, } from 'snarkyjs';
import { KeyedDataStore } from '../../src/lib/data_store/KeyedDataStore';
class Account extends CircuitValue {
    constructor(balance, publicKey) {
        super();
        this.balance = balance;
        this.publicKey = publicKey;
    }
    // NOTE: there seems to be an issue with the default toFields() method ?
    toFields() {
        return this.balance.toFields().concat(this.publicKey.toFields());
    }
}
__decorate([
    prop
], Account.prototype, "balance", void 0);
__decorate([
    prop
], Account.prototype, "publicKey", void 0);
describe('KeyedDataStore', () => {
    before(async () => {
        await isReady;
    });
    after(async () => {
        shutdown();
    });
    it('should construct KeyedDataStore', () => {
        var _a, _b, _c, _d;
        let store = new KeyedDataStore();
        let dataLeaves = new Map();
        let accountA = new Account(UInt64.fromNumber(100), PrivateKey.random().toPublicKey());
        dataLeaves.set('A', accountA);
        let accountB = new Account(UInt64.fromNumber(100), PrivateKey.random().toPublicKey());
        dataLeaves.set('B', accountB);
        let accountC = new Account(UInt64.fromNumber(100), PrivateKey.random().toPublicKey());
        dataLeaves.set('C', accountC);
        let accountCnew = new Account(UInt64.fromNumber(330), PrivateKey.random().toPublicKey());
        dataLeaves.set('C', accountCnew);
        let ok = store.fromData(dataLeaves);
        assert(ok, "coudln't successfully build KeyedDataStore!");
        let accountD = new Account(UInt64.fromNumber(330), PrivateKey.random().toPublicKey());
        // store.set('A', accountA);
        // store.set('B', accountB);
        console.log('HELLO');
        store.set('C', accountC);
        store.set('D', accountD);
        //store.set('C', accountCnew);
        // store.merkleTree.printTree();
        // for (let [key, value] of store.dataStore) {
        //   console.log(key + ' ' + value.balance.toString());
        // }
        let root = store.getMerkleRoot();
        assert(root !== undefined, 'merkle root is undefiend!');
        // console.log('root ', root.toString());
        assert(store.validateProof(store.getProof(Poseidon.hash(accountA.toFields())), Poseidon.hash(accountA.toFields()), root === undefined ? Field(0) : root));
        assert(store.validateProof(store.getProof(Poseidon.hash(accountB.toFields())), Poseidon.hash(accountB.toFields()), root === undefined ? Field(0) : root));
        assert(store.validateProof(store.getProof(Poseidon.hash(accountC.toFields())), Poseidon.hash(accountC.toFields()), root === undefined ? Field(0) : root));
        store.merkleTree.tree.leaves.forEach((el) => {
            console.log(el);
        });
        store.dataStore.forEach((el) => {
            console.log(el);
        });
        assert(((_a = store.get('C')) === null || _a === void 0 ? void 0 : _a.equals(accountCnew).toBoolean()) === false);
        assert((_b = store.get('B')) === null || _b === void 0 ? void 0 : _b.equals(accountB).toBoolean());
        assert((_c = store.get('A')) === null || _c === void 0 ? void 0 : _c.equals(accountA).toBoolean());
        assert((_d = store.get('C')) === null || _d === void 0 ? void 0 : _d.equals(accountC).toBoolean());
    });
});
