import casual from 'casual';

const mocks = {
  String: () => 'It works!',
  Query: () => ({
    user: (root, args) => ({
      firstName: args.firstName,
      lastName: args.lastName,
      id: casual.integer,
    }),
  }),
  User: () => ({
    firstName: () => casual.first_name,
    lastName: () => casual.last_name,
    id: casual.integer(0, 1000),
  }),
  Post: () => ({ id: casual.integer(0, 1000), content: casual.sentences(2) }),
};

export default mocks;
