import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `#graphql
type Query {
  users(filter: String, limit: Int): [User!]!
  user(offset: Int, limit: Int): User
  getPostFeed(offset: Int, limit: Int): [Post!]!
}

type Mutation {
  createUser(firstName: String!, lastName: String!, email: String!, password: String!): User
  login(email: String!, password: String!): User
  deleteUser(userId: ID!): User
  
  addFriend(friendId: ID!): User
  removeFriend(friendId: ID!): User
  
  addPartnership(postId: ID!): Post
  removePartnership(postId: ID!): Post
  
  createPost(content: String!): Post
  deletePost(postId: ID!): Post
}

type User {
  id: ID!
  firstName: String!
  lastName: String!
  email: String!
  profilePhoto: String
  jwt: String
  posts(
    limit: Int
  ): [Post!]!
  friends(
    limit: Int,
    offset: Int
  ): [User!]!
  partneredPosts(
    limit: Int,
    offset: Int
  ): [Post!]!
}

type Post {
  id: ID!
  owner: ID!
  content: String!
  partnerCount: Int
  partners: [User!]!
  isPartnered: Boolean
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
export default schema;
