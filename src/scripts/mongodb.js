/**
 * mongodb 连接数据库测试
 */
const {
  mongoConf: { url, dbName },
} = require('../config');
const { MongoClient } = require('mongodb');

// https://www.mongodb.com/docs/drivers/node/current/usage-examples/findOne/
const client = new MongoClient(url);

async function getDBObject() {
  await client.connect();
  console.log('------ Connected to mongodb server successfully!!! ------');
  const db = client.db(dbName);
  return db;
}

module.exports = getDBObject;
