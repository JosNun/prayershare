// import { User, Post } from './connectors';

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
    createUser: (root, args, context, info) => {
      context.prisma.mutation.createUser(
        {
          data: {
            firstName: args.firstName,
            lastName: args.lastName,
          },
        },
        info
      );
    },
    createPost: (root, args, context, info) =>
      context.prisma.mutation.createPost(
        {
          data: {
            content: args.content,
            owner: {
              connect: {
                id: args.ownerId,
              },
            },
          },
        },
        info
      ),
    deletePost: (root, args, context, info) =>
      context.prisma.mutation.deletePost(
        {
          data: {
            id: args.id,
          },
        },
        info
      ),
    addFriend: (root, args, context, info) =>
      context.prisma.mutation
        .createUserRelation({
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
        })
        .then(() =>
          context.prisma.query.user(
            {
              where: {
                id: args.userId,
              },
            },
            info
          )
        ),
    removeFriend(root, args, context, info) {
      // TODO: Check for duplicate entries here
      return context.prisma.mutation
        .deleteManyUserRelations({
          where: {
            user: {
              id: args.userId,
            },
            relatesTo: {
              id: args.friendId,
            },
          },
        })
        .then(() =>
          context.prisma.query.user({
            where: {
              id: args.userId,
            },
          })
        );
    },
  },
};

export default resolvers;
