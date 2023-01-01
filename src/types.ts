import { GraphQLSchema } from 'graphql';

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

export declare interface GenerateGraphqlShieldArgs {
  schema: GraphQLSchema;
  options: GenerateGraphqlShieldOptions;
}
