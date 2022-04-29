/* eslint-disable no-unused-vars */
import { Circuit, CircuitValue, Field } from 'snarkyjs';

export default interface ISerializableField /* <C extends CircuitValue> */ {
  serialize(): Field[];
}
