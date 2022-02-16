export default interface ITtransaction {
  from: string;
  to: string;
  amount: number;
  nonce: number;
  memo: string;
}
