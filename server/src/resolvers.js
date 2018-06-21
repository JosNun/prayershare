import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from './db';
import mailer from './mailer';

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
    getPostFeed: async (_, args, ctx) => {
      const { userId } = ctx;
      const limit = args.limit || 10;
      const offset = args.offset || 0;

      const posts = await db
        .from('users as friends')
        .join('userFriend', 'friends.id', 'userfriend.friendId')
        .leftOuterJoin('users as user', 'user.id', 'userFriend.userId')
        .join('posts', 'friends.uid', 'posts.userUid')
        .select(
          'posts.content',
          'posts.userUid as owner',
          'posts.uid as id',
          'posts.createdAt',
          db.raw(
            'exists(select 1 from userPartnership where :partnershipUser: = :userId: and :partnershipPost: = :postId:) as isPartnered',
            {
              partnershipUser: 'userPartnership.userId',
              userId: 'user.id',
              partnershipPost: 'userPartnership.postId',
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
  Post: {
    partnerCount: async (post, args, ctx) => {
      let [partnerCount] = await db('posts')
        .select(
          db.raw(
            '(select count(*) from userPArtnership where userPartnership.postId = posts.id) as amount'
          )
        )
        .join('userPartnership', 'userPArtnership.postId', 'posts.id')
        .where('posts.uid', post.id);

      partnerCount = partnerCount ? partnerCount.amount : 0;

      return partnerCount;
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
      }, Please confirm your PrayerShare account at this link: ${confirmUrl}`;
      const htmlMail = `Hey ${
        user.firstName
      },<br>Please confirm your PrayerShare account at this link: <a href="${confirmUrl}">${confirmUrl}</a>`;

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
        return new Error("Account doesn't exist");
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
    createPost: async (_, args, ctx) => {
      const post = await db('posts')
        .insert({
          content: args.content,
          userUid: ctx.userId,
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
    deletePost: async (_, args, context) => {
      const { postId } = args;
      const [post] = await db('posts')
        .select('userUid', 'uid as id')
        .where('uid', postId);

      if (post.userUid !== context.userId) {
        return new Error('User is not authorized to perform this action');
      }

      await db('posts')
        .where('uid', postId)
        .del();

      return post;
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
