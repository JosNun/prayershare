import Sequelize from 'sequelize';
import casual from 'casual';
import configs from '../config';

const env = process.env.NODE_ENV || 'development';

const config = configs[env];

const db = new Sequelize(
  config.database.db,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
    dialect: 'mysql',
    logging: false, // Disable this to view SQL queries
    operatorsAliases: false, // Prevent the string version of operators to prevent string injection
  }
);

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
  isHidden: {
    type: Sequelize.BOOLEAN,
  },
});

UserModel.hasMany(PostModel);
PostModel.belongsTo(UserModel);

UserModel.belongsToMany(UserModel, { as: 'friend', through: 'UserFriend' });

UserModel.belongsToMany(PostModel, {
  as: 'partnership',
  through: 'UserPartnership',
});

UserModel.belongsToMany(PostModel, {
  as: 'hiddenPost',
  through: 'UserHiddenPosts',
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
          isHidden: Math.round(Math.random()),
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
