import Sequelize, { Op } from 'sequelize';
import casual from 'casual';

const db = new Sequelize('prayerShare', 'josiah', 'pass', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Disable this to view SQL queries
});

const UserModel = db.define('users', {
  firstName: { type: Sequelize.STRING(36), allowNull: false },
  lastName: { type: Sequelize.STRING(36), allowNull: false },
  profilePhoto: { type: Sequelize.STRING(1024) },
});

const PostModel = db.define('posts', {
  content: {
    type: Sequelize.STRING(1024),
    allowNull: false,
  },
});

UserModel.hasMany(PostModel);
PostModel.belongsTo(UserModel);

UserModel.belongsToMany(UserModel, { as: 'friend', through: 'UserFriend' });

UserModel.belongsToMany(PostModel, {
  as: 'partnership',
  through: 'UserPartnership',
});
casual.seed(3141);

db.sync({ force: true }).then(() => {
  for (let i = 0; i < 5; i += 1) {
    UserModel.create({
      firstName: casual.first_name,
      lastName: casual.last_name,
    }).then(user => {
      for (let j = 0; j < 2; j += 1) {
        PostModel.create({
          userId: user.id,
          content: casual.sentences(2),
        });
      }

      if (i === 1) {
        const friendId = casual.integer(1, i);
        db.models.users.findOne({ where: { id: friendId } }).then(lastUser => {
          user.addFriend(lastUser);
        });
      } else if (i > 1) {
        for (let j = 0; j < 2; j += 1) {
          const friendId = casual.integer(1, i);
          db.models.users
            .findOne({ where: { id: friendId } })
            .then(lastUser => {
              user.addFriend(lastUser);
            });
        }
      }
    });
  }
});

const User = db.models.users;
const Post = db.models.posts;

export { User, Post };
