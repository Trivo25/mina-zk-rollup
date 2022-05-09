/* eslint-disable no-unused-vars */
import { Circuit, CircuitValue, Field } from 'snarkyjs';

export default interface IHashable<C extends CircuitValue> {
  getHash(): Field;
}
