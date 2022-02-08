'use strict';
// TODO: remove
/* eslint-disable no-unused-vars */
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
exports.__esModule = true;
exports.MerkleTreeFactory = exports.Node = void 0;
var snarkyjs_1 = require('snarkyjs');
var Node = /** @class */ (function () {
  function Node(left, right, hash) {
    this.left = left;
    this.right = right;
    this.hash = hash;
  }
  Node.prototype.getLeft = function () {
    return this.left;
  };
  Node.prototype.setLeft = function (left) {
    this.left = left;
  };
  Node.prototype.getRight = function () {
    return this.right;
  };
  Node.prototype.setRight = function (right) {
    this.right = right;
  };
  Node.prototype.getHash = function () {
    return this.hash;
  };
  Node.prototype.setHash = function (hash) {
    this.hash = hash;
  };
  Node.prototype.print = function () {
    var root = this;
    if (root === undefined || root === null) {
      return;
    }
    if (
      root.getLeft() === undefined ||
      (root.getLeft() === null && root.getRight() === undefined) ||
      root.getRight() === null
    ) {
      console.log(root.getHash().toString());
    }
    var queue = [];
    queue.push(root);
    queue.push(undefined);
    while (queue.length !== 0) {
      var node = queue.shift();
      if (node !== undefined) {
        console.log(node.getHash().toString());
      } else {
        if (queue.length !== 0) {
          console.log('---');
          queue.push(undefined);
        }
      }
      if (node !== undefined && node.getLeft() !== undefined) {
        queue.push(node.getLeft());
      }
      if (node !== undefined && node.getRight() !== undefined) {
        queue.push(node.getRight());
      }
    }
  };
  return Node;
})();
exports.Node = Node;
var MerkleTreeFactory = /** @class */ (function () {
  function MerkleTreeFactory() {}
  /**
   * Creates and returns a new tree based on an list of data blobs
   * @param dataBlocks List of data blobs
   * @returns a Merkle tree
   */
  MerkleTreeFactory.treeFromList = function (dataBlocks) {
    var childNodes = [];
    dataBlocks.forEach(function (el) {
      childNodes.push(
        new Node(undefined, undefined, snarkyjs_1.Poseidon.hash([el]))
      );
    });
    return this.buildTree(childNodes);
  };
  /**
   * Builds the tree
   * @param children List of children Node
   * @returns a Merkle tree
   */
  MerkleTreeFactory.buildTree = function (children) {
    var parents = [];
    while (children.length != 1) {
      var index = 0;
      var length_1 = children.length;
      while (index < length_1) {
        var leftChild = children[index];
        var rightChild = void 0;
        if (index + 1 < length_1) {
          rightChild = children[index + 1];
        } else {
          rightChild = new Node(undefined, undefined, leftChild.getHash());
        }
        var parentHash = snarkyjs_1.Poseidon.hash([
          leftChild.getHash(),
          rightChild.getHash(),
        ]);
        parents.push(new Node(leftChild, rightChild, parentHash));
        index += 2;
      }
      children = parents;
      parents = [];
    }
    return children[0];
  };
  /**
   * Checks if an element exists in a Merkle tree that leads to a root
   * @param index of element to proof
   * @param treeSize of the the tree
   * @param root merkle root
   * @param path path to the root
   * @returns true if element exists, false otherwise
   */
  MerkleTreeFactory.merkleProof = function (index, treeSize, root, path) {
    return true;
  };
  return MerkleTreeFactory;
})();
exports.MerkleTreeFactory = MerkleTreeFactory;
// for debugging purposes
test();
function test() {
  return __awaiter(this, void 0, void 0, function () {
    var nodeData, a, b, root, t;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, snarkyjs_1.isReady];
        case 1:
          _a.sent();
          nodeData = [
            (0, snarkyjs_1.Field)(0),
            (0, snarkyjs_1.Field)(1),
            (0, snarkyjs_1.Field)(2),
            (0, snarkyjs_1.Field)(3),
          ];
          a = snarkyjs_1.Poseidon.hash([
            snarkyjs_1.Poseidon.hash([(0, snarkyjs_1.Field)(0)]),
            snarkyjs_1.Poseidon.hash([(0, snarkyjs_1.Field)(1)]),
          ]);
          b = snarkyjs_1.Poseidon.hash([
            snarkyjs_1.Poseidon.hash([(0, snarkyjs_1.Field)(2)]),
            snarkyjs_1.Poseidon.hash([(0, snarkyjs_1.Field)(3)]),
          ]);
          root = snarkyjs_1.Poseidon.hash([a, b]);
          t = MerkleTreeFactory.treeFromList(nodeData);
          // console.log(root.toString());
          // console.log(t.getHash().toString());
          t.print();
          (0, snarkyjs_1.shutdown)();
          return [2 /*return*/];
      }
    });
  });
}
