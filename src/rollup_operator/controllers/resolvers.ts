import { RollupService } from '../services/RollupService.js';
import {
  Resolvers as ResolversTypes,
  ZkappCommandInput,
} from './generated/graphql_types.js';
export { Resolvers };

function Resolvers(rs?: RollupService): ResolversTypes {
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
    Mutation: {
      sendZkapp: async (_: any, { input: x }: { input: ZkappCommandInput }) => {
        console.log(JSON.stringify(x));
        return 'xxxx';
      },
    },
  };
}
