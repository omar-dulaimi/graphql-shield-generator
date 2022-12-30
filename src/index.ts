import { getRootTypeMap } from '@graphql-tools/utils';
import { GraphQLSchema } from 'graphql';
import path from 'path';
import { cwd } from 'process';
import { constructShield } from './helpers';
import type { RootType } from './types';
import { writeFileSafely } from './utils/writeFileSafely';

export const generateGraphqlShield = async (schema: GraphQLSchema) => {
  const queries: RootType = [];
  const mutations: RootType = [];
  const subscriptions: RootType = [];

  const rootTypeMap = getRootTypeMap(schema);
  for (const [, rootType] of rootTypeMap.entries()) {
    const typeName = rootType.name;
    const fields = rootType.getFields();
    for (const [resolverName] of Object.entries(fields)) {
      if (typeName === 'Query') {
        queries.push(resolverName);
      } else if (typeName === 'Mutation') {
        mutations.push(resolverName);
      } else if (typeName === 'Subscription') {
        subscriptions.push(resolverName);
      }
      // TODO: handle other resolvers
    }
  }

  queries.sort();
  mutations.sort();
  subscriptions.sort();

  const shieldText = constructShield({ queries, mutations, subscriptions });
  // TODO: provide option for output path
  await writeFileSafely(path.join(cwd(), 'shield.ts'), shieldText);
  // TODO: provide option to generate a JS shield
};
