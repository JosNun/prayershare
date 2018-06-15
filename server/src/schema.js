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
  
  addPartnership(postId: ID!, userId: ID!): Post
  removePartnership(postId: ID!, userID: ID!): Post
  
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
    limit: Int
  ): [User!]!
  partnershipsConnection(
    first: Int,
    after: String,
    last: Int,
    before: String
  ): UserPartnershipsConnection
}

type UserPartnershipsConnection {
  pageInfo: PageInfo!
  edges: [UserPartnershipsEdge]
}

type UserPartnershipsEdge {
  cursor: String!
  node: Post
  partneredAt: DateTime!
}

type Post {
  id: ID!
  owner: ID!
  content: String!
  partnerCount: Int
  partners: [User!]!
}

type PageInfo {
  count: Int
  hasNextPage: Boolean
}

type DateTime {
  utc: String
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
export default schema;
