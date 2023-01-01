import { makeExecutableSchema } from '@graphql-tools/schema';
import { getRootTypeMap } from '@graphql-tools/utils';
import { GraphQLSchema } from 'graphql';
import path from 'path';
import { cwd } from 'process';
import type {
  ConstructShieldArgs,
  GenerateGraphqlShieldOptions,
  ShieldGeneratorSchema,
  TypeResolverMap
} from './types';

export const constructShield = ({ typeResolverMap }: ConstructShieldArgs) => {
  let rootItems = '';

  for (const [type, resolverNames] of Object.entries(typeResolverMap)) {
    if (type.length > 0) {
      const subscriptionLinesWrapped = `${type}: ${wrapWithObject({
        shieldItemLines: resolverNames.sort().map((resolverName) => `${resolverName}: allow`),
      })},`;
      rootItems += subscriptionLinesWrapped;
    }
  }

  if (rootItems.length === 0) return '';

  let shieldText = getImports('graphql-shield');
  shieldText += '\n\n';
  shieldText += wrapWithExport({
    shieldObjectText: wrapWithGraphqlShieldCall({
      shieldObjectTextWrapped: wrapWithObject({ shieldItemLines: rootItems }),
    }),
  });

  return shieldText;
};

export const getTypeResolverMap = async (schema: ShieldGeneratorSchema) => {
  if (!(schema instanceof GraphQLSchema)) {
    schema = await makeExecutableSchema({ typeDefs: schema.typeDefs, resolvers: schema.resolvers });
  }

  const typeResolverMap: TypeResolverMap = {};

  const rootTypeMap = getRootTypeMap(schema);
  for (const [, rootType] of rootTypeMap.entries()) {
    const typeName = rootType.name;
    const fields = rootType.getFields();
    for (const [resolverName] of Object.entries(fields)) {
      if (!typeResolverMap[typeName]) {
        typeResolverMap[typeName] = [];
      }
      if (typeName === 'Query') {
        typeResolverMap[typeName].push(resolverName);
      } else if (typeName === 'Mutation') {
        typeResolverMap[typeName].push(resolverName);
      } else if (typeName === 'Subscription') {
        typeResolverMap[typeName].push(resolverName);
      }
    }
  }

  const typeMap = schema.getTypeMap();
  for (const typeName in typeMap) {
    const type = typeMap[typeName];
    if (
      type.astNode?.kind === 'ObjectTypeDefinition' &&
      !['Query', 'Mutation', 'Subscription'].includes(type.name)
    ) {
      const foundType = schema.getType(type.name);
      //@ts-ignore
      const fields = foundType?.toConfig().fields;
      Object.keys(fields).forEach((fieldName) => {
        const field = fields[fieldName];
        const resolver = field.resolve;
        if (resolver) {
          if (!typeResolverMap[type.name]) {
            typeResolverMap[type.name] = [];
          }
          typeResolverMap[type.name].push(fieldName);
        }
      });
    }
  }

  return typeResolverMap;
};

export const getOutputPath = (options: GenerateGraphqlShieldOptions) => {
  const ext = `.${options.extension ?? 'js'}`;
  const dirPath = options.outputDir ? path.resolve(cwd(), options.outputDir) : path.join(cwd());

  const filePath = path.format({
    dir: dirPath,
    name: options.fileName,
    ext: ext,
  });
  return filePath;
};

export const wrapWithObject = ({
  shieldItemLines,
}: {
  shieldItemLines: Array<string> | string;
}) => {
  let wrapped = '{';
  wrapped += '\n';
  wrapped += Array.isArray(shieldItemLines)
    ? '  ' + shieldItemLines.join(',\r\n')
    : '  ' + shieldItemLines;
  wrapped += '\n';
  wrapped += '}';
  return wrapped;
};

export const getImports = (type: 'graphql-shield') => {
  const shieldImportStatement = "import { shield, allow } from 'graphql-shield';\n";
  return shieldImportStatement;
};

export const wrapWithExport = ({ shieldObjectText }: { shieldObjectText: string }) => {
  return `export const permissions = ${shieldObjectText};`;
};

export const wrapWithGraphqlShieldCall = ({
  shieldObjectTextWrapped,
}: {
  shieldObjectTextWrapped: string;
}) => {
  let wrapped = 'shield(';
  wrapped += '\n';
  wrapped += '  ' + shieldObjectTextWrapped;
  wrapped += '\n';
  wrapped += ')';
  return wrapped;
};
