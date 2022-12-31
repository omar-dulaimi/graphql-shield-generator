import { getRootTypeMap } from '@graphql-tools/utils';
import { GraphQLSchema } from 'graphql';
import path from 'path';
import { cwd } from 'process';
import { constructShield } from './helpers';
import type { RootType, CustomPath } from './types';
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

  queries.sort();
  mutations.sort();
  subscriptions.sort();

  const shieldText = constructShield({ queries, mutations, subscriptions });
  const ext = js ? 'js' : 'ts';
  let filePath = customPath.path ? path.resolve(cwd(), customPath?.path, 'shield') : path.join(cwd(), 'shield');

  filePath = path.format({
    dir: path.dirname(filePath),
    name: path.basename(filePath, path.extname(filePath)),
    ext: `.${ext}`,
  });

  await writeFileSafely(filePath, shieldText);
};
