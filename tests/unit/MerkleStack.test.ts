import { isReady, PrivateKey, shutdown } from 'snarkyjs';

import { MerkleStack } from '../../src/lib/data_store/MerkleStack';

describe('DataStack', () => {
  beforeAll(async () => {
    await isReady;
  });

  afterAll(async () => {
    shutdown();
  });

  it('should construct DataStack', () => {
    // TODO: cleanup tests
    // TODO: test more edge cases
    let stack = new MerkleStack();

    let a = PrivateKey.random().toPublicKey();
    let b = PrivateKey.random().toPublicKey();
    let c = PrivateKey.random().toPublicKey();

    stack.push(a);
    expect(stack.size() === 1);
    stack.push(b);
    expect(stack.size() === 2);
    stack.push(c);
    expect(stack.size() === 3);
    expect(stack.pop() === c);
    expect(stack.size() === 2);

    expect(stack.pop() === b);
    expect(stack.size() === 1);

    expect(stack.pop() === a);
    expect(stack.size() === 0);
  });
});
