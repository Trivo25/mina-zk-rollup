import { gql } from 'apollo-server-express';

export { Schema };

const Schema = gql`
  type Person {
    id: ID!
    name: String
  }
  #handle user commands
  type Query {
    getAllPeople: [Person] #will return multiple Person instances
    getPerson(id: Int): Person #has an argument of 'id' of type Integer.
  }
`;
