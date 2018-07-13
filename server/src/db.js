import knex from 'knex';
import config from './config';

process.env.SQL_INSTANCE_CONNECTION_NAME &&
process.env.NODE_ENV === 'production'
  ? console.log('using prod')
  : console.log('using dev');

const db = knex({
  client: 'mysql',
  connection:
    process.env.SQL_INSTANCE_CONNECTION_NAME &&
    process.env.NODE_ENV === 'production'
      ? config.production.db
      : config.dev.db,
});

export default db;
