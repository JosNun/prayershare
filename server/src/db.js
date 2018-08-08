import knex from 'knex';
import config from './config';

process.env.NODE_ENV === 'production'
  ? console.log('using prod')
  : console.log('using dev');

const db = knex({
  client: 'mysql',
  connection:
    process.env.NODE_ENV === 'production'
      ? config.production.db
      : config.dev.db,
});

export default db;
