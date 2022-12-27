import { SmartContract } from 'snarkyjs';
export { createRollup };

type Settings = Partial<{
  sequencer: {
    port: number;
  };
}>;

function createRollup(contract: SmartContract, settings: Settings) {
  return {
    start() {},
    deploy() {},
  };
}
