import Knex from 'knex';
import { attachPaginate } from 'knex-paginate';

const knexDB = Knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT as unknown as number || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'stemsiweb',
    database: process.env.DB_NAME || 'sasca',
  },
});

export const knexDBHelpers = {
  currentDate() {
    return knexDB.raw('CURRENT_DATE')
  },
  addTimeStamp() {
    const currentTimestamp = knexDB.raw('CURRENT_TIMESTAMP');

    return {
      created_at: currentTimestamp,
      updated_at: currentTimestamp
    }
  },
  addUpdateTimeStamp() {
    return {
      updated_at: knexDB.raw('CURRENT_TIMESTAMP')
    }
  }
};

attachPaginate();

export default knexDB;