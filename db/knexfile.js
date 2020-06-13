require('dotenv').config({ path: '../.env'});

module.exports = {

  development: {
    client: 'pg',
    connection: {
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: 'board'
    },
    useNullAsDefault: true,
    debug: true,
    pool: {
      min: 1,
      max: 5
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};
