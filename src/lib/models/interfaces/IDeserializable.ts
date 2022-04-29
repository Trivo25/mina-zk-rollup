/* eslint-disable no-unused-vars */
import { Field } from 'snarkyjs';

export default interface IDeserializable {
  deserialize(xs: Field[]): Object;
}
