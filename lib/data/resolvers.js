import { User, Post } from './connectors';

const resolvers = {
  Query: {
    user(root, args) {
      return User.find({ where: args });
    },
    allUsers() {
      return User.findAll();
    },
    allPosts() {
      Post.findAll();
    },
  },
  Mutation: {
    addPost(root, args) {
      return User.find({ where: { id: args.ownerId } })
        .then(user =>
          Post.create({ content: args.content }).then(post => {
            user.addPost(post);
            return post;
          })
        )
        .then(post => {
          const { id, content } = post.dataValues;
          return {
            id,
            content,
          };
        });
    },

    hidePost(root, args) {
      return User.find({ where: { id: args.userId } }).then(user =>
        Post.find({ where: { id: args.postId } }).then(post => {
          user.addHiddenPost(post);
          return post.dataValues.id;
        })
      );
    },

    addFriend(root, args) {
      return User.find({ where: { id: args.userId } }).then(user =>
        User.find({ where: { id: args.friendId } }).then(friend => {
          user.addFriend(friend);
          return friend.dataValues;
        })
      );
    },

    addPartnership(root, args) {
      return User.find({ where: { id: args.userId } }).then(user =>
        Post.find({ where: { id: args.postId } }).then(post => {
          user.addPartnership(post);
          return post.dataValues;
        })
      );
    },
  },
  User: {
    posts(user) {
      return user.getPosts();
    },
    friends(user) {
      return user.getFriend();
    },
    partneredPosts(user) {
      return user.getPartnership();
    },
  },
  Post: {
    owner(post) {
      return post.getUser();
    },
  },
};

export default resolvers;
