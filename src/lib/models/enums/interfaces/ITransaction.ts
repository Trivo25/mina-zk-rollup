/**
 * Interface for REST API transactions.
 */
export default interface ITransaction {
  from: string;
  to: string;
  amount: string;
  nonce: string;
  tokenId: string;

  signature: {
    r: string;
    s: string;
  };
}
