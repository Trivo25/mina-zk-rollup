import { RollupService } from './RollupService.js';

export { Resolvers };

const people = ['Max', 'Moritz'];

function Resolvers(rs: RollupService) {
  return {
    Query: {
      getAllPeople: () => people,
      getPerson: (_: any, args: any) => {
        console.log(args);
        return people.find((person) => person === args);
      },
    },
  };
}
