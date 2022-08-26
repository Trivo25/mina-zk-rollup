/**
 * Interface for REST API deposits.
 */
export default interface IDeposit {
  to: string;
  publicKey: string;
  amount: string;
  tokenId: string;

  index: string;

  signature: {
    r: string;
    s: string;
  };
}
