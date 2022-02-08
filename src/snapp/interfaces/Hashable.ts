import { Field } from 'snarkyjs';

export default interface Hashable {
  hash(): Field;
}
