import bcrypt from 'bcrypt';
import db from './db';

const resolvers = {
  Query: {
    users: (_, args) => {},
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
        .then(userId =>
          db
            .select()
            .from('users')
            .where('id', userId)
            .then(userRows => userRows[0])
        );
      return user;
    },
  },
};

export default resolvers;
