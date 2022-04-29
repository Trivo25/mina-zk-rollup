/* eslint-disable no-unused-vars */
import { Circuit, CircuitValue, Field } from 'snarkyjs';

export default interface IDeserializableField<C extends Circuit> {
  // workaround since Interfaces cannot include static methods
  deserializeInto(xs: Field[]): void;
}
