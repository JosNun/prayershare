import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from './db';
import mailer from './mailer';
import { LoginError, SignupError } from './utils/errors';

const resolvers = {
  Query: {
    getPostFeed: async (_, args, ctx) => {
      const { userId } = ctx;
      const limit = args.limit || 10;
      const offset = args.offset || 0;

      const posts = await db
        .from('users as friends')
        .join('UserFriend', 'friends.id', 'UserFriend.friendId')
        .leftOuterJoin('users as user', 'user.id', 'UserFriend.userId')
        .join('posts', 'friends.uid', 'posts.userUid')
        .select(
          'posts.content',
          'posts.userUid as owner',
          'posts.uid as id',
          'posts.createdAt',
          db.raw(
            'exists(select 1 from UserPartnership where :partnershipUser: = :userId: and :partnershipPost: = :postId:) as isPartnered',
            {
              partnershipUser: 'UserPartnership.userId',
              userId: 'user.id',
              partnershipPost: 'UserPartnership.postId',
              postId: 'posts.id',
            }
          )
        )
        .where('user.uid', userId)
        .unionAll(query => {
          query
            .select(
              'posts.content',
              'posts.userUid as owner',
              'posts.uid as id',
              'posts.createdAt',
              db.raw('0 as isPartnered')
            )
            .from('posts')
            .where('userUid', userId);
        })
        .limit(limit)
        .offset(offset)
        .orderBy('createdAt', 'desc');

      return posts;
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
  },
};

export default resolvers;
