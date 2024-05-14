const jwt = require('koa-jwt');
const { JWT_SECRET } = require('../config/constant');

module.exports = jwt({
  secret: JWT_SECRET,
  cookie: 'jwt', // 使用 cookie 存储 token
}).unless({
  path: [/\//], // 全部忽略即可, 需要登录验证的, 自己用 loginCheck , 这样比较灵活
});
