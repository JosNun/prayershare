import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from './db';

const resolvers = {
  Query: {
    users: async (_, args) => {
      const users = await db('users')
        .column({ id: 'uid' }, 'firstName', 'lastName', 'email', 'profilePhoto')
        .select();

      return users;
    },
    user: async (_, args, ctx) => {
      let user = await db
        .column({ id: 'uid' }, 'firstName', 'lastName', 'email', 'profilePhoto')
        .select()
        .from('users')
        .where('uid', ctx.userId);

      [user] = user;

      return user;
    },
  },

  User: {
    posts: async (user, args, context) => {
      console.log('getting posts...');
      console.log(user);
      console.log(args);
      console.log(context);

      let posts;

      if (args.limit) {
        posts = await db
          .column({ id: 'uid', author: 'userUid' }, 'content')
          .select()
          .from('posts')
          .where({
            userUid: context.userId,
          })
          .whereNull('isDeleted')
          .limit(args.limit);
      } else {
        posts = await db
          .column({ id: 'uid', author: 'userUid' }, 'content')
          .select()
          .from('posts')
          .where({
            userUid: context.userId,
          })
          .whereNull('isDeleted');
      }

      return posts;
    },
    friends: async (user, args, context) => {
      console.log(`user: ${JSON.stringify(user)}`);
      console.log(`args: ${JSON.stringify(args)}`);
      const userUid = context.userId;

      let userId = await db('users')
        .select('id')
        .where('uid', userUid);

      userId = userId[0].id;

      let friends;

      if (args.limit) {
        friends = await db('users')
          .column({ id: 'uid' }, 'firstName', 'lastName', 'profilePhoto')
          .select()
          .limit(args.limit)
          .join('userfriend', query => {
            query
              .on('userfriend.friendId', '=', 'users.id')
              .andOn('userId', '=', userId);
          });
      } else {
        friends = await db('users')
          .column({ id: 'uid' }, 'firstName', 'lastName', 'profilePhoto')
          .select()
          .join('userfriend', query => {
            query
              .on('userfriend.friendId', '=', 'users.id')
              .andOn('userId', '=', userId);
          });
      }

      return friends;
    },
  },
  Mutation: {
    createUser: async (_, args) => {
      const rows = await db('users')
        .where({
          email: args.email.toLowerCase(),
        })
        .select('id');

      const emailExists = Object.keys(rows).length !== 0;
      if (emailExists) {
        const error = new Error(
          'A user already exists for that email address.'
        );
        error.name = 'Signup Error';
        return error;
      }

      const passHash = await bcrypt.hash(args.password, 5);

      const user = await db('users')
        .insert({
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email.toLowerCase(),
          password: passHash,
        })
        .then(userId => {
          const uid = Buffer.from(`users:${userId}`).toString('base64');
          return db('users')
            .where('id', userId)
            .update('uid', uid)
            .select(uid)
            .then(() =>
              db
                .select()
                .from('users')
                .where('id', userId)
                .then(userRows => userRows[0])
            );
        });

      const token = await new Promise((resolve, reject) => {
        jwt.sign(
          { sub: user.uid },
          process.env.JWT_SECRET_KEY,
          (err, newToken) => {
            resolve(newToken);
          }
        );
      });

      return {
        ...user,
        id: user.uid,
        jwt: token,
      };
    },
    login: async (_, args, context) => {
      let user = await db('users')
        .select('uid', 'firstName', 'password')
        .where('email', args.email);

      if (user.length === 0) {
        return new Error("Account doesn't exist");
      }

      [user] = user;

      const passwordMatches = await bcrypt.compare(
        args.password,
        user.password
      );

      if (!passwordMatches) {
        return new Error('Invalid password');
      }

      const token = await new Promise((resolve, reject) => {
        jwt.sign(
          { sub: user.uid },
          process.env.JWT_SECRET_KEY,
          (err, newToken) => {
            resolve(newToken);
          }
        );
      });

      return {
        id: user.uid,
        firstName: user.firstName,
        jwt: token,
      };
    },
    createPost: async (_, args) => {
      const post = await db('posts')
        .insert({
          content: args.content,
          userUid: args.ownerId,
        })
        .then(postId => {
          const uid = Buffer.from(`posts:${postId}`).toString('base64');
          return db('posts')
            .where('id', postId)
            .update('uid', uid)
            .select(uid)
            .then(postUid =>
              db
                .select()
                .from('posts')
                .where('id', postId)
                .then(postRows => postRows[0])
            );
        });

      return {
        ...post,
        id: post.uid,
        owner: post.userUid,
      };
    },
    addFriend: async (_, args) => {
      let userId = await db('users')
        .select('id')
        .where('uid', args.userId);
      let friendId = await db('users')
        .select('id')
        .where('uid', args.friendId);
      userId = userId[0].id;
      friendId = friendId[0].id;
      const friend = await db('UserFriend')
        .insert({
          userId,
          friendId,
        })
        .then(row =>
          db('users')
            .column({ id: 'uid' }, 'firstName', 'lastName', 'profilePhoto')
            .select()
            .from('users')
            .where({
              uid: args.friendId,
            })
        );

      console.log(friend);

      return friend[0];
    },
  },
};

export default resolvers;
