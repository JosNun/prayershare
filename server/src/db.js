import knex from 'knex';
import config from './config';

// if (
//   process.env.INSTANCE_CONNECTION_NAME &&
//   process.env.NODE_ENV === 'production'
// ) {
//   config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
//   console.log('setting for production db');
// }

const db = knex({
  client: 'mysql',
  connection:
    process.env.SQL_INSTANCE_CONNECTION_NAME &&
    process.env.NODE_ENV === 'production'
      ? config.production.db
      : config.dev.db,
});

export default db;
