interface Signature {
  publicKey: string;
  signature: {
    field: string;
    scalar: string;
  };
  payload: string;
}
