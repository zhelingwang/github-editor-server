/**
 * redis 连接
 * docs: https://redis.io/docs/latest/commands/expire/
 */
const Redis = require('ioredis');
const {
  redisConf: { port, host },
} = require('../config');
const log = require('../utils/log');

let instance = null;

function initRedis() {
  if (!instance) {
    instance = new Redis({
      port,
      host,
    });
    instance.on('error', function (err) {
      log.error('[redis] error: ' + err);
      throw err;
    });
    instance.on('connect', function (...args) {
      log.success('[redis] connected to redis successfully!');
    });
  }
  return instance;
}

module.exports = initRedis();
