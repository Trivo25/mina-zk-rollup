import { gql } from 'apollo-server-express';
import fs from 'fs';

export { Schema };

const importGraphQL = (file: string) => {
  return fs.readFileSync(file, 'utf-8');
};

const gqlWrapper = (...files: string[]) => {
  return gql`
    ${files}
  `;
};

const s = importGraphQL('./src/rollup_operator/controllers/schema.graphql');

const Schema = gqlWrapper(s);
