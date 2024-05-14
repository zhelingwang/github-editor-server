/**
 * docs: https://mongoosejs.com/docs/connections.html
 */
const mongoose = require('mongoose');
const path = require('path');
const log = require('../utils/log');

const {
  mongoConf: { url, dbName, user, pass },
} = require('../config');

let mongodbConn = null;

function createMongodbConnection() {
  if (!mongodbConn) {
    mongoose.connect(`${url}/${dbName}`, {
      user,
      pass,
      authSource: 'admin',
    });
    mongoose.connection.on('connected', () => {
      log.success('[mongodb] Connection has been established successfully.');
      mongodbConn = mongoose;
      // compile model with schema
      require('require-all')({
        dirname: path.resolve(__dirname, 'schemas'),
        filter: /(.+)\.js$/,
        excludeDirs: /^\.(git|svn)$/,
        recursive: true,
        map: function (name, path) {
          // Mongoose automatically looks for the plural, lowercased version of your model name.
          // eg: User -> use 'users' as collection name in mongodb
          const _schema = require(path);
          mongoose.model(name, _schema);
        },
      });
      log.verbose(`[mongodb] models: `, mongoose.models);
    });
    mongoose.connection.on('error', function (err) {
      log.error('mongoose connect error: ' + err.message);
      throw err;
    });
  }
  return mongoose;
}

module.exports = createMongodbConnection();
