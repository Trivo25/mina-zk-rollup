import { Signature } from 'snarkyjs';
import { ISignature } from '../models';

export default function signatureFromInterface(
  sigInterface: ISignature
): Signature {
  let signature = Signature.fromJSON({
    r: sigInterface.r,
    s: sigInterface.s,
  });
  return signature!;
}
