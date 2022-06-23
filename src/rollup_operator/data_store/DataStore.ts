export default interface DataStore {
  clearInstructions(): void;

  commit(): Promise<void>;

  clear(): Promise<void>;
}
