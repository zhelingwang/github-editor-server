const { Sequelize, DataTypes } = require('sequelize');
const { mysqlConf } = require('../config');
const path = require('path');
const log = require('../utils/log');

// 全局变量保存 Sequelize 连接对象
let sequelizeObj = null;

function createSeqInstance() {
  if (!sequelizeObj) {
    sequelizeObj = new Sequelize(
      mysqlConf.database,
      mysqlConf.user,
      mysqlConf.password,
      {
        dialect: 'mysql',
        host: mysqlConf.host,
        port: mysqlConf.port,
        // timezone: mysqlConf.timezone,
        // use table origin name without modification
        // other rules: https://sequelize.org/docs/v6/core-concepts/model-basics/#table-name-inference
        define: {
          freezeTableName: true,
        },
        pool: mysqlConf.pool || {},
      },
    );
    //  testing connection
    sequelizeObj
      .authenticate()
      .then(() => {
        log.success(
          '[sequelize] Connection has been established successfully.',
        );
        //  import all your models into Sequelize
        require('require-all')({
          dirname: path.resolve(__dirname, 'models'),
          filter: /(.+)\.js$/,
          excludeDirs: /^\.(git|svn)$/,
          recursive: true, // 递归
          map: function (name, path) {
            require(path)(sequelizeObj, DataTypes);
          },
        });
        log.verbose('[sequelize] models: ', sequelizeObj.models);
      })
      .catch((error) => {
        log.error('[sequelize] Unable to connect to the database:', error);
        throw error;
      });
  }
  return sequelizeObj;
}

module.exports = createSeqInstance();
