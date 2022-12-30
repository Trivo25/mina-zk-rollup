import { RollupService } from './RollupService.js';

export { Resolvers };

function Resolvers(rs: RollupService) {
  return {
    Query: {
      getGlobalState: () => {
        return {
          pendingDeposits: ['idk'],
          state: {
            committed: {
              pendingDepositsCommitment: 'String',
              accountDbCommitment: 'String',
            },
            current: {
              pendingDepositsCommitment: 'String',
              accountDbCommitment: 'String',
            },
          },
        };
      },
    },
  };
}
