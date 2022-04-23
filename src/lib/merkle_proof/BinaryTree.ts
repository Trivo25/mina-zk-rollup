import { Field } from 'snarkyjs';

export default interface Tree {
  leaves: Field[];
  levels: Field[][];
}
