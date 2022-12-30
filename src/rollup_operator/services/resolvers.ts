import { RollupService } from './RollupService.js';
import { Resolvers } from '../controllers/generated/graphql_types.js';

export { Resolvers };

function Resolvers(rs: RollupService): Resolvers {
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
