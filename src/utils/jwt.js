const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/constant');

function signJwt(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
}

function verifyJwt(token) {
  try {
    // token.split(' ')[1] , 注意校验时需要移除token前面的 'Bearer'
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = {
  signJwt,
  verifyJwt,
};
