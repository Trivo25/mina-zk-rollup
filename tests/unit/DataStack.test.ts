import { assert, expect } from 'chai';
import { before, describe, it } from 'mocha';
import {
  CircuitValue,
  Field,
  isReady,
  Poseidon,
  PrivateKey,
  prop,
  PublicKey,
  shutdown,
  UInt64,
} from 'snarkyjs';

import { DataStack } from '../../src/lib/data_store/DataStack';

describe('DataStack', () => {
  before(async () => {
    await isReady;
  });

  after(async () => {
    shutdown();
  });

  it('should construct DataStack', () => {
    // TODO: cleanup tests
    // TODO: test more edge cases
    let stack = new DataStack();

    let a = PrivateKey.random().toPublicKey();
    let b = PrivateKey.random().toPublicKey();
    let c = PrivateKey.random().toPublicKey();

    stack.push(a);
    expect(stack.size() === 1);
    stack.push(b);
    expect(stack.size() === 2);
    stack.push(c);
    expect(stack.size() === 3);
    assert(stack.pop() === c);
    expect(stack.size() === 2);

    assert(stack.pop() === b);
    expect(stack.size() === 1);

    assert(stack.pop() === a);
    expect(stack.size() === 0);
  });
});
