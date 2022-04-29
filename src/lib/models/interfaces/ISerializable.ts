/* eslint-disable no-unused-vars */
import { Circuit, CircuitValue, Field } from 'snarkyjs';

export default interface ISerializable /* <C extends CircuitValue> */ {
  serialize(): Field[];
}
