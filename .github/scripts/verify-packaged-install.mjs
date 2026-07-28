// Runs the README's headline command against an INSTALLED copy of the package.
//
// It must be executed with the current working directory set to a throwaway directory that has
// `graphql-shield-generator` (from `npm pack`) and its `graphql` peer installed, and that is NOT
// inside this repository. Running it inside the repo would let Node resolve the repo's own
// node_modules and source tree, which is precisely the mistake this check exists to catch.
import assert from 'node:assert/strict';
import { readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

import { parse } from 'graphql';
// Exactly the import the README tells users to write.
import { generateGraphqlShield } from 'graphql-shield-generator';

const require = createRequire(import.meta.url);
const installedFrom = require.resolve('graphql-shield-generator');
console.log(`node            ${process.version}`);
console.log(`cwd             ${process.cwd()}`);
console.log(`resolved from   ${installedFrom}`);

assert.ok(
  installedFrom.includes(`node_modules${'/'}graphql-shield-generator`),
  `graphql-shield-generator resolved to ${installedFrom}, which is not an installed copy. ` +
    'This check has to run against the packed tarball, not a source checkout.',
);
assert.equal(typeof generateGraphqlShield, 'function', 'generateGraphqlShield is not exported by the installed package');

const typeDefs = parse(/* GraphQL */ `
  type User {
    id: ID!
    email: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
  }

  type Query {
    users: [User!]!
    me: User
  }

  type Mutation {
    createUser(email: String!): User!
  }
`);

const resolvers = {
  Query: { users: () => [], me: () => null },
  Mutation: { createUser: () => null },
  User: { posts: () => [] },
};

const outputDir = './permissions';
rmSync(resolve(process.cwd(), outputDir), { recursive: true, force: true });

// The README's Quick Start, verbatim in shape.
await generateGraphqlShield({
  schema: { typeDefs, resolvers },
  options: {
    outputDir,
    fileName: 'shield',
    extension: 'ts',
    moduleSystem: 'ES modules',
  },
});

const generated = readFileSync(resolve(process.cwd(), outputDir, 'shield.ts'), 'utf8');
console.log('--- generated shield.ts ---');
console.log(generated);
console.log('--- end ---');

// Exit 0 is not enough on its own: the generator writes its output as a side effect, so a
// silently empty or truncated shield would still leave the process happy.
for (const expected of [
  "import { shield, allow } from 'graphql-shield';",
  'export const permissions = shield(',
  'Query: {',
  "users: allow",
  'Mutation: {',
  "createUser: allow",
  'User: {',
  "posts: allow",
]) {
  assert.ok(generated.includes(expected), `generated shield is missing ${JSON.stringify(expected)}`);
}

console.log('OK: the packaged install generated a usable shield.');
