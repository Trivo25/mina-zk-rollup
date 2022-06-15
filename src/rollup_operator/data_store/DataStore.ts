export default interface DataStore {
  clearInstructions(): void;

  commit(): void;
}
