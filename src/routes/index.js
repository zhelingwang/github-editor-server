const router = require('koa-router')();
const mysqldb = require('../db');
const mongodb = require('../mongodb');
const { redis, getCache, setCache } = require('../redis/actionRedis');

const loginCheck = require('../middleware/loginCheck');

router.get('/user', loginCheck, async (ctx, next) => {
  const { name } = ctx.state.user;
  await ctx.render('index', {
    title: `Hello Koa 2! ${name} login`,
  });
});

router.get('/db/check', async (ctx, next) => {
  const data = await mysqldb.models.demo.findAll();

  const res = await mongodb.models.User.create({
    name: 'yanfeng.guan',
    age: '30',
    email: 'gmail@gmail.com',
  });

  await setCache('data', { name: 'hello' });
  const value = await getCache('data');
  ctx.body = {
    mysql: data,
    mongo: res,
    value,
  };
});

module.exports = router;
