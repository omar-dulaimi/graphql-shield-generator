import type { DocumentNode, GraphQLSchema } from 'graphql';

export declare interface TypeResolverMap {
  [name: string]: Array<string>;
}

export declare interface ConstructShieldArgs {
  typeResolverMap: TypeResolverMap;
}

export declare interface GenerateGraphqlShieldOptions {
  outputDir: string;
  fileName: string;
  extension: 'js' | 'ts';
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
