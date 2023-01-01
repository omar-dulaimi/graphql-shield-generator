import { constructShield, getOutputPath, getTypeResolverMap } from './helpers';
import type { GenerateGraphqlShieldArgs } from './types';
import { writeFileSafely } from './utils/writeFileSafely';

export const generateGraphqlShield = async ({ schema, options }: GenerateGraphqlShieldArgs) => {
  const typeResolverMap = await getTypeResolverMap(schema);
  const shieldText = constructShield({ typeResolverMap });
  const outputPath = getOutputPath(options);

  await writeFileSafely(outputPath, shieldText);
};
