/* @flow */

import fs from 'fs';
import path from 'path';

import {graphql, parse, buildASTSchema, introspectionQuery} from 'graphql';
import 'isomorphic-fetch';

const GRAPHQL_PORT = 8080;

(async () => {
  try {
    const response = await fetch(`http://localhost:${GRAPHQL_PORT}/schema`);
    const typeDefs = await response.text();
    const schema = buildASTSchema(parse(typeDefs));
    const result = await graphql(schema, introspectionQuery);

    fs.writeFileSync(
      path.join(__dirname, '../graphql-schema.json'),
      JSON.stringify(result, null, 2),
    );
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    process.exit(1); // eslint-disable-line unicorn/no-process-exit
  }
})();
