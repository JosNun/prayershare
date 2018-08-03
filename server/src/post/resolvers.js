import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LoginError, SignupError } from '../utils/errors';
import db from '../db';
import mailer from '../mailer';

const resolvers = {
  Query: {},
  Post: {
    partnerCount: async (post, args, ctx) => {
      let [partnerCount] = await db('posts')
        .select(
          db.raw(
            '(select count(*) from UserPartnership where UserPartnership.postId = posts.id) as amount'
          )
        )
        .join('UserPartnership', 'UserPartnership.postId', 'posts.id')
        .where('posts.uid', post.id);

      partnerCount = partnerCount ? partnerCount.amount : 0;

      return partnerCount;
    },
  },
  Mutation: {
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
  },
};

export default resolvers;
