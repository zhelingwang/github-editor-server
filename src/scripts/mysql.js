/**
 * mysql2 连接数据库测试
 */
const mysql = require('mysql2/promise');
const { mysqlConf } = require('../config');

async function testConnection() {
  const conn = await mysql.createConnection({
    ...mysqlConf,
    timezone: '+0800',
  });
  const [result, fields] = await conn.execute('SELECT now();');
  return result;
}

module.exports = {
  testConnection,
};
