// import Hashable from '../interfaces/Hashable';
// import { MerkleTree } from '../interfaces/MerkleTree';, Node } from './MerkleTree';
// import { Field } from 'snarkyjs';

// // NOTE should the key also be Hashable or only the value?
// class KeyedDataStore<K, V extends Hashable> {
//   dataStore: Map<K, V>;
//   merkleTree: Node | undefined;

//   constructor() {
//     this.dataStore = new Map<K, V>();
//     this.merkleTree = undefined;
//   }

//   fromDataBlobs(dataBlobs: Map<K, V>): boolean {
//     // this.merkleTree = MerkleTreeFactory.buildTree(dataBlobs.values);

//     // TODO: return true if creation was successful
//     return true;
//   }

//   get(key: K): V | undefined {
//     return this.dataStore.get(key);
//   }

//   set(key: K, value: V) {
//     // NOTE is pass by reference?
//     // TODO: update merkle tree
//     this.dataStore.set(key, value);
//   }
// }
