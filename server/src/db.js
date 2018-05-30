import knex from 'knex';
import config from './config';

const db = knex({
  client: 'mysql',
  connection: {
    host: config.db.host,
    user: config.db.user,
    password: config.db.user,
    database: config.db.database,
  },
});

export default db;
