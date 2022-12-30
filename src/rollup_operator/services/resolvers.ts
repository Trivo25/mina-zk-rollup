import { RollupService } from './RollupService.js';
import {
  InputMaybe,
  Maybe,
  MutationSendZkappArgs,
  RequireFields,
  Resolver,
  Resolvers as ResolversTypes,
  ResolverTypeWrapper,
  ZkappCommandInput,
} from '../controllers/generated/graphql_types.js';
import { ParentType } from 'aws-sdk/clients/organizations.js';

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
