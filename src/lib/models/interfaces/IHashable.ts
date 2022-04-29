/* eslint-disable no-unused-vars */
import { Circuit, CircuitValue, Field } from 'snarkyjs';

export default interface Hashable /* <C extends CircuitValue> */ {
  getHash(): Field;
}
