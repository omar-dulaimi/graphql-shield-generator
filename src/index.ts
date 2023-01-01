import { getRootTypeMap } from '@graphql-tools/utils';
import { GraphQLSchema } from 'graphql';
import { constructShield, getOutputPath, sortShieldItems } from './helpers';
import type { CustomPath, RootType } from './types';
import { writeFileSafely } from './utils/writeFileSafely';

export const generateGraphqlShield = async (schema: GraphQLSchema, customPath: CustomPath, js: boolean = false) => {
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

  sortShieldItems(queries, mutations, subscriptions);

  const shieldText = constructShield({ queries, mutations, subscriptions });
  const outputPath = getOutputPath(customPath, js);

  await writeFileSafely(outputPath, shieldText);
};
