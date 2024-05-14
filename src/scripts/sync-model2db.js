/**
 * 同步 sequelize models 到数据库数据表
 */
const db = require('../db');
const log = require('../utils/log');
async function syncModel2DB() {
  // This creates the table if it doesn't exist (and does nothing if it already exists)
  await db.sync();
  // This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
  await db.sync({ alter: true });
  log.success('All models were synchronized successfully!!!');
  process.exit(0);
}

syncModel2DB();
