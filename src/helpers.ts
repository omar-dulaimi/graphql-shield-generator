import { makeExecutableSchema } from '@graphql-tools/schema';
import { getRootTypeMap } from '@graphql-tools/utils';
import { GraphQLSchema } from 'graphql';
import path from 'path';
import { cwd } from 'process';
import type { ConstructShieldArgs, GenerateGraphqlShieldOptions, ShieldGeneratorSchema, TypeResolverMap } from './types';

export const constructShield = ({ typeResolverMap, options }: ConstructShieldArgs) => {
  let rootItems = '';

  // Sort types by priority if groupbyobjects is enabled
  const typeEntries = Object.entries(typeResolverMap);
  const sortedTypes = options.groupbyobjects 
    ? typeEntries.sort(([typeA], [typeB]) => {
        const priority = { Query: 1, Mutation: 2, Subscription: 3 };
        const priorityA = priority[typeA as keyof typeof priority] || 99;
        const priorityB = priority[typeB as keyof typeof priority] || 99;
        if (priorityA !== priorityB) return priorityA - priorityB;
        return typeA.localeCompare(typeB);
      })
    : typeEntries;

  for (const [type, resolverNames] of sortedTypes) {
    if (type.length > 0) {
      const sortedResolvers = resolverNames.sort().map((resolverName) => `'${resolverName}': ${options.customrule ?? 'allow'}`);
      const subscriptionLinesWrapped = `${type}: ${wrapWithObject({
        shieldItemLines: sortedResolvers,
        options,
      })},`;
      rootItems += subscriptionLinesWrapped;
    }
  }

  if (rootItems.length === 0) return '';

  let shieldText = getImports('graphql-shield', options);
  shieldText += '\n\n';
  shieldText += wrapWithExport({
    shieldObjectText: wrapWithGraphqlShieldCall({
      shieldObjectTextWrapped: wrapWithObject({ shieldItemLines: rootItems, options }),
    }, options),
    options,
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
    if (type.astNode?.kind === 'ObjectTypeDefinition' && !['Query', 'Mutation', 'Subscription'].includes(type.name)) {
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
    name: options.fileName ?? 'shield',
    ext: ext,
  });
  return filePath;
};

const wrapWithObject = ({ shieldItemLines, options }: { shieldItemLines: Array<string> | string; options?: GenerateGraphqlShieldOptions }) => {
  let wrapped = '{';
  wrapped += '\n';
  
  if (Array.isArray(shieldItemLines)) {
    const fallbackRule = options?.fallbackRule;
    const fallbackLine = fallbackRule ? `  '*': ${fallbackRule},\n` : '';
    wrapped += fallbackLine + '  ' + shieldItemLines.join(',\n  ');
  } else {
    wrapped += '  ' + shieldItemLines;
  }
  
  wrapped += '\n';
  wrapped += '}';
  return wrapped;
};

const getImports = (type: 'graphql-shield', options: GenerateGraphqlShieldOptions) => {
  const needsDeny = options.fallbackRule === 'deny';
  const needsAllow = !options.customrule || options.fallbackRule === 'allow';
  
  const imports = ['shield'];
  if (needsAllow) imports.push('allow');
  if (needsDeny) imports.push('deny');
  
  switch (options.moduleSystem) {
    case 'ES modules':
      let result = `import { ${imports.join(', ')} } from '${type}';\n`;
      if (options.customrule) {
        result += `import { ${options.customrule} } from '${options.customrulepath}';\n`;
      }
      return result;
    case 'CommonJS':
    default:
      let resultCommon = `const { ${imports.join(', ')} } = require('${type}');\n`;
      if (options.customrule) {
        resultCommon += `const { ${options.customrule} } = require('${options.customrulepath}');\n`;
      }
      return resultCommon;
  }
};

const wrapWithExport = ({ shieldObjectText, options }: { shieldObjectText: string; options: GenerateGraphqlShieldOptions }) => {
  switch (options.moduleSystem) {
    case 'ES modules':
      return ` export const permissions = ${shieldObjectText};`;
    case 'CommonJS':
    default:
      return ` module.exports.permissions = ${shieldObjectText};`;
  }
};

const wrapWithGraphqlShieldCall = ({ shieldObjectTextWrapped }: { shieldObjectTextWrapped: string }, options: GenerateGraphqlShieldOptions) => {
  let wrapped = 'shield(';
  wrapped += '\n';
  wrapped += '  ' + shieldObjectTextWrapped;
  wrapped += `\n, ${options.shieldoptions ?? '' }`;
  wrapped += ')';
  return wrapped;
};
