const { isProd } = require('../utils/env');

const envName = isProd ? 'prod.js' : 'dev.js';
const extraConf = require(`./env/${envName}`);
const { mysqlConf, mongoConf, redisConf } = extraConf;

module.exports = {
  mysqlConf: {
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306,
    database: 'test',
    // TODO: mysql && mongodb
    // timezone: "+08:00", // 时区偏移
    ...mysqlConf,
  },
  mongoConf: {
    // url: 'mongodb://localhost:27017',
    user: 'lyon',
    pass: 'root',
    url: 'mongodb://lyon:root@localhost:27017',
    dbName: 'lyon-cli',
    ...mongoConf,
  },
  redisConf: {
    port: 6379,
    host: '127.0.0.1',
    ...redisConf,
  },
};
