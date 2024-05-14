const { ErrorRes, errorInfo } = require('../response');
const { verifyJwt } = require('../utils/jwt');
const { noAuth } = errorInfo;

module.exports = async function (ctx, next) {
  const error = new ErrorRes(noAuth);
  // 从header获取 token
  const token = ctx.headers.authorization;
  if (!token) {
    ctx.body = error;
    return;
  }
  // 验证token
  const result = verifyJwt(token);
  if (result === null) {
    ctx.body = error;
    return;
  }
  console.log('payload from token: ', result);
  ctx.state.user = result;
  await next();
};
