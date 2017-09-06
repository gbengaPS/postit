// {
//   "development": {
//     "use_env_variable": "postgres://postgres@localhost:5432/postgres"
//   },
//   "test": {
//    "use_env_variable": "TEST_DB"
//   },
//   "production": {
//     "use_env_variable": "DATABASE_URL",
//     "dialect": "postgres",
//     "dialectOptions": {
//       "ssl" : true
//     }
//   }
// }
const dotenv = require('dotenv');

dotenv.load();
const config = {
  development: {
    use_env_variable: 'DEV_DB',
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'DATABASE_PRODUCTION_URL',
    dialect: 'postgres',
  },
  test: {
    use_env_variable: 'DATABASE_TEST_URL',
    dialect: 'postgres',
  },
};
module.exports = config;
