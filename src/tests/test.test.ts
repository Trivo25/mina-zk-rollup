import { assert, expect } from 'chai';

import { Field } from 'snarkyjs';
import { test } from '../src/ex';

it('pass', () => {
  expect(test().equals(Field(0)).toBoolean());
});
