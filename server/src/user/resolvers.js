import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LoginError, SignupError } from '../utils/errors';
import db from '../db';
import mailer from '../mailer';

const resolvers = {
  Query: {
    users: async (_, args, ctx) => {
      const filter = args.filter ? args.filter : '';
      const limit = args.limit ? args.limit : 10;

      const users = await db('users')
        .column({ id: 'uid' }, 'firstName', 'lastName', 'email', 'profilePhoto')
        .select()
        .where(query => {
          query
            .where('firstName', 'like', `%${filter}%`)
            .orWhere('lastName', 'like', `%${filter}%`);
        })
        .andWhere('uid', '!=', ctx.userId)
        .limit(limit);

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
          .whereNull('isDeleted')
          .orderBy('createdAt', 'desc');
      }

      return posts;
    },
    friends: async (user, args, context) => {
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
          .join('UserFriend', query => {
            query
              .on('UserFriend.friendId', '=', 'users.id')
              .andOn('userId', '=', userId);
          });
      } else {
        friends = await db('users')
          .column({ id: 'uid' }, 'firstName', 'lastName', 'profilePhoto')
          .select()
          .join('UserFriend', query => {
            query
              .on('UserFriend.friendId', '=', 'users.id')
              .andOn('userId', '=', userId);
          });
      }

      return friends;
    },
    partneredPosts: async (_, args, ctx) => {
      const limit = args.limit || 10;

      const partnered = await db('posts')
        .select(
          'posts.uid as id',
          'posts.content',
          'posts.userUid as owner',
          db.raw('1 as isPartnered')
        )
        .leftOuterJoin('UserPartnership', 'posts.id', 'UserPartnership.postId')
        .leftOuterJoin('users', 'users.id', 'UserPartnership.userId')
        .where('users.uid', ctx.userId)
        .limit(limit);

      return partnered;
    },
  },
  Mutation: {
    createUser: async (_, args, ctx) => {
      const rows = await db('users')
        .where({
          email: args.email.toLowerCase(),
        })
        .select('id');

      const emailExists = Object.keys(rows).length !== 0;
      if (emailExists) {
        return new SignupError();
      }

      const passHash = await bcrypt.hash(args.password, 12);

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
            .select('uid', 'email', 'firstName')
            .then(() =>
              db
                .select()
                .from('users')
                .where('id', userId)
                .then(userRows => userRows[0])
            );
        });

      const host = ctx.req.get('host');
      const confirmUrl = `https://${host}/verify/${user.uid}`;
      const plainTextMail = `Hey ${
        user.firstName
      }, Please confirm your PrayerShare account at this link: ${confirmUrl} . Didn't try to create an account? Please ignore this email.`;
      const htmlMail = `Hey ${
        user.firstName
      },<br>Please confirm your PrayerShare account at this link: <a href="${confirmUrl}">${confirmUrl}</a>. Didn't try to create an account? Please ignore this email.`;

      mailer.sendMail({
        to: user.email,
        subject: 'Confirm your account',
        text: plainTextMail,
        html: htmlMail,
      });

      // const token = await new Promise((resolve, reject) => {
      //   jwt.sign(
      //     { sub: user.uid },
      //     process.env.JWT_SECRET_KEY,
      //     (err, newToken) => {
      //       resolve(newToken);
      //     }
      //   );
      // });

      return {
        ...user,
        id: user.uid,
        // jwt: token,
      };
    },
    login: async (_, args, context) => {
      let user = await db('users')
        .select('uid', 'firstName', 'password', 'verified')
        .where('email', args.email);

      if (user.length === 0) {
        return new LoginError();
      }

      [user] = user;

      if (!user.verified) {
        return new Error("Account hasn't been verified. Check your email!");
      }

      const passwordMatches = await bcrypt.compare(
        args.password,
        user.password
      );

      if (!passwordMatches) {
        return new LoginError();
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
    addFriend: async (_, args, context) => {
      let userId = await db('users')
        .select('id')
        .where('uid', context.userId);
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

      return friend[0];
    },
    removeFriend: async (_, args, context) => {
      const [{ id: userId }] = await db('users')
        .select('id')
        .where('uid', context.userId);
      const [{ id: friendId }] = await db('users')
        .select('id')
        .where('uid', args.friendId);

      const unfriended = await db('UserFriend')
        .where({
          userId,
          friendId,
        })
        .del()
        .then(row =>
          db('users')
            .column({ id: 'uid' }, 'firstName', 'lastName', 'profilePhoto')
            .select()
            .from('users')
            .where({
              uid: args.friendId,
            })
        );

      return unfriended[0];
    },
    addPartnership: async (_, args, ctx) => {
      const postUid = args.postId;
      const userUid = ctx.userId;

      const ids = await db('users')
        .select('users.id as userId', 'posts.id as postId')
        .join('posts')
        .where('users.uid', userUid)
        .andWhere('posts.uid', postUid);

      const [{ userId }] = ids;
      const [{ postId }] = ids;

      const partnership = await db('UserPartnership').insert({
        userId,
        postId,
      });

      return {
        id: postUid,
        isPartnered: true,
      };
    },
    removePartnership: async (_, args, ctx) => {
      const postUid = args.postId;
      const userUid = ctx.userId;

      const ids = await db('users')
        .select('users.id as userId', 'posts.id as postId')
        .join('posts')
        .where('users.uid', userUid)
        .andWhere('posts.uid', postUid);

      const [{ userId }] = ids;
      const [{ postId }] = ids;

      const partnership = await db('UserPartnership')
        .del()
        .where('userId', userId)
        .andWhere('postId', postId);

      return {
        id: postUid,
        isPartnered: false,
      };
    },
  },
};

export default resolvers;
