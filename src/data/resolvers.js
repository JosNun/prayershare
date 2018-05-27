import { User, Post } from './connectors';

const resolvers = {
  Query: {
    posts: (root, args, context, info) =>
      context.prisma.query.posts(
        {
          where: {
            content_contains: args.searchString,
          },
        },
        info
      ),
    user: (root, args, context, info) =>
      context.prisma.query.user(
        {
          where: {
            id: args.id,
          },
        },
        info
      ),
  },
  Mutation: {
    createPost: (root, args, context, info) =>
      context.prisma.createPost({
        data: {
          content: args.content,
          owner: {
            connect: {
              id: args.ownerId,
            },
          },
        },
      }),
    deletePost: (root, args, context, info) =>
      context.prisma.mutation.deletePost({
        data: {
          id: args.id,
        },
      }),
    addFriend: (root, args, context, info) => {
      context.prisma.mutation.createUserRelation({
        data: {
          user: {
            connect: {
              id: args.userId,
            },
          },
          relatesTo: {
            connect: {
              id: args.friendId,
            },
          },
          relation: 'FOLLOWING',
        },
        info,
      });
      return context.prisma.query.user(
        {
          where: {
            id: args.userId,
          },
        },
        info
      );
    },
  },
};

export default resolvers;
