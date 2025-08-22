import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    published: Boolean!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
    updateUser(id: ID!, name: String, email: String): User!
    deleteUser(id: ID!): Boolean!
    createPost(title: String!, content: String!, authorId: ID!): Post!
    updatePost(id: ID!, title: String, content: String): Post!
    deletePost(id: ID!): Boolean!
  }

  type Subscription {
    userAdded: User!
    postAdded: Post!
  }
`;

export const resolvers = {
  Query: {
    users: () => [],
    user: () => null,
    posts: () => [],
    post: () => null,
  },
  Mutation: {
    createUser: () => null,
    updateUser: () => null,
    deleteUser: () => false,
    createPost: () => null,
    updatePost: () => null,
    deletePost: () => false,
  },
  Subscription: {
    userAdded: {
      subscribe: () => {},
    },
    postAdded: {
      subscribe: () => {},
    },
  },
  User: {
    posts: () => [],
  },
  Post: {
    author: () => null,
  },
};