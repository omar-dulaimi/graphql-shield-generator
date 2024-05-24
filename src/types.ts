import type { DocumentNode, GraphQLSchema } from 'graphql';

export declare interface TypeResolverMap {
  [name: string]: Array<string>;
}

export declare interface ConstructShieldArgs {
  typeResolverMap: TypeResolverMap;
  options: GenerateGraphqlShieldOptions;
}

export declare interface GenerateGraphqlShieldOptions {
  outputDir?: string;
  fileName?: string;
  extension?: 'js' | 'ts';
  moduleSystem?: 'CommonJS' | 'ES modules';
  customrule?: string;
  customrulepath?: string;
  shieldoptions?: string;
}

export declare interface TypeDefsAndResolversArgs {
  typeDefs: DocumentNode;
  resolvers: any;
}

export declare type ShieldGeneratorSchema = GraphQLSchema | TypeDefsAndResolversArgs;

export declare interface GenerateGraphqlShieldArgs {
  schema: ShieldGeneratorSchema;
  options: GenerateGraphqlShieldOptions;
}
