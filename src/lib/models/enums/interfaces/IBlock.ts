import ITransaction from './ITransaction.js';

/**
 * Interface for REST API transactions.
 */
export default interface IBlock {
  transactions: ITransaction[];
  status?: string;
  new_state_root?: string;
  previous_state_root?: string;
  id?: string;
  time?: string;
}
