/* eslint-disable no-unused-vars */
import { Circuit, CircuitValue, Field } from 'snarkyjs';

export default interface IDeserializableField<C extends CircuitValue> {
  deserialize(xs: Field[]): C;
}
