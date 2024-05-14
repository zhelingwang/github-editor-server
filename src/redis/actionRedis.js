const redis = require('.');

/**
 * 设置 key-value
 * 过期时间 expire, 单位: 秒
 * @param {*} key
 * @param {*} val
 * @param {*} expire 默认 1 hour
 */
async function setCache(key, val, expire = 60 * 60) {
  if (val && typeof val === 'object') {
    val = JSON.stringify(val);
  }
  return await redis.set(key, val, 'EX', expire);
}

/**
 * 获取key
 * @param {*} key
 */
async function getCache(key) {
  let result = await redis.get(key);
  try {
    result = JSON.parse(result);
    // eslint-disable-next-line
	} catch (e) {}
  return result;
}

module.exports = {
  redis,
  setCache,
  getCache,
};
