/* eslint-disable no-unused-vars */
enum EnumError {
  InvalidSignature = 'The provided signature is not valid.',
  BrokenSignature = 'The provided signature is broken or not in the correct format.',
  SigNotMatchPub = 'Signature PublicKey does not match Transaction Sender Public Key.',
  InvalidMethod = 'Invalid Method specified within transaction.',
  InvalidPublicKey = 'Invalid Public Key provided.',
}
export default EnumError;
