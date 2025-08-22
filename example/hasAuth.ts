import { rule } from 'graphql-shield';

export const hasAuth = rule({ cache: 'contextual' })(
  async (parent, args, context, info) => {
    return context.user !== null;
  }
);