interface ISignature {
  publicKey: string;
  signature: {
    field: string;
    scalar: string;
  };
  payload: string;
}
