import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
// import mocks from './mocks';
import resolvers from './resolvers';

const gql = string => string; // Fancy function that returns what it was given (basically, I wanted a way to make syntax highlighting to work)

const typeDefs = `#graphql
  type Query {
    testString: String
    user(firstName: String, lastName: String, id: Int): User
    allUsers: [User]
    post(id: Int, owner: Int): Post
    allPosts: [Post]
    partneredPost(id: Int, partner: Int): Post
  }

  type Mutation {
    addPost(ownerId: Int!, content: String!): Post
    hidePost(userId: Int!, postId: Int!): Int
    addFriend(userId: Int!, friendId: Int!): User
    addPartnership(userId: Int!, postId: Int!): Post
  }

  type User {
    id: Int
    firstName: String
    lastName: String
    avatarUrl: String
    friends: [User]
    posts: [Post]
    partneredPosts: [Post]
  }

  type Post {
    id: Int
    content: String
    owner: User
    partners: Int
  }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

// addMockFunctionsToSchema({ schema, mocks });

export default schema;
