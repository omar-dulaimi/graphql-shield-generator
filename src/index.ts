import { GraphQLSchema } from 'graphql';
import { constructShield, getOutputPath, getTypeResolverMap } from './helpers';
import type { CustomPath } from './types';
import { writeFileSafely } from './utils/writeFileSafely';

export const generateGraphqlShield = async (schema: GraphQLSchema, customPath: CustomPath, js: boolean = false) => {
  const typeResolverMap = getTypeResolverMap(schema);
  const shieldText = constructShield({ typeResolverMap });
  const outputPath = getOutputPath(customPath, js);

  await writeFileSafely(outputPath, shieldText);
};
