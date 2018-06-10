import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `#graphql
type Query {
  users: [User!]!
  user(id: ID!): User
}

type Mutation {
  createUser(firstName: String!, lastName: String!, email: String!, password: String!): User
  deleteUser(userId: ID!): User
  
  addFriend(userId: ID!, friendId: ID!): User
  removeFriend(userId: ID!, friendId: ID!): User
  
  addPartnership(postId: ID!, userId: ID!): Post
  removePartnership(postId: ID!, userID: ID!): Post
  
  createPost(ownerId: ID!, content: String!): Post
  deletePost(id: ID!): Post
}

type User {
  id: ID!
  firstName: String!
  lastName: String!
  email: String!
  profilePhoto: String
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
