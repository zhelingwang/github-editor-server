# editor-server
编辑器后端系统

## 技术选型
主要内容:
- nodejs框架选型: koa2.x
	- 常用的nodejs服务端框架: express/koa2/egg.js/next/nuxt/nest.js
	- express/koa2 小而美
- 数据库: mysql / Mongodb / Redis
	- 操作框架: mysql -> sequelize, MongoDB -> Mongoose, Redis -> ioredis
- 登录校验: JWT
- 单元测试和接口测试: jest
- 线上服务: PM2 + Nginx

技术选型的主要思考点:
- 所覆盖的需求场景
- 学习成本以及开发成本, 开发效率


## koa2.x
使用中间件`koa-generator`初始化项目目录结构
[https://github.com/koajs/koa/wiki#middleware](middleware)

## Mysql
- database driver: `mysql2`
- 使用广泛的 orm 框架: `sequelize`

### sequelize
- 创建连接
- 创建mysql数据表table
- 使用`sequelize-auto`命令行工具执行脚本, 为table自动生成对应的model到项目中
- 将model导入到sequelize实例
- sequelize实例通过model来操作table

### model与table的双向同步
1. table -> model
```bash
sequelize-auto -o "./src/db/models" -d test -h localhost -u root -p 3306 -x root -t demo
```

2. model -> table
[https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization](Model synchronization)

## mongodb
1. 创建连接, 注意认证账号的权限
2. 导入model到连接实例mongoose
3. mongoose.models.CollectionName 使用

## myslq与mongodb的区别
二者均是磁盘数据库, 与redis作为内存数据库相区分
- mysql 关系型数据库, 用于存储表格形式的格式规整的结构化数据
	- 多个table之间可依据关联关系进行联表查询join

- mongodb 文档数据库, 用于存储文件和格式零散的非结构化数据
	- 相关联的数据直接存储在同一个文档中
	- 数据结构可灵活变化, 每一个BSON格式的数据就是一个独立的文档(BSON: 以二进制数据存储的JSON数据)

总结: 结构化数据? + 联表查询?

## redis
场景: 多核CPU擅长处理多进程任务, 而我们的webServer也是多进程运行的, 但是多个进程之间的内存是相互隔离的, 无法共享的. 

为实现多个进程之间可以共享同一份缓存数据, 就需要借助第三方缓存服务redis来实现.


## 登录&校验
常见的三种方式:
1. cookie && session
2. JWT
3. SSO(单点登陆) / OAuth2(第三方登陆验证)

### cookie && session
1. 用户名/密码 -> 后端
2. 后端验证通过后以 set-cookie 向客户端种植 cookie(userId)
3. 后续所有的接口请求自动带上cookie

客户端 cookie 存储 userId; 服务端的 session 存储用户信息

优缺点:
- 简单易学且用户信息存储在服务端, 可快速封禁某个登录的用户
- 占用服务器的内存, 有硬件成本
- 多进程, 多服务器时不好同步, 需要使用第三方 redis 存储, 增加使用成本
	- 跨域传递cookie, 需要特殊配置
		ent: withCredential`

### (JWT) Json Web Token
1. 用户名密码 -> 后端验证
2. 通过后, 服务器使用私钥+用户信息 -> 加密生成token -> 种植到客户端(cookie/localStorage)
3. 客户端后续请求(header)携带上token -> 服务端
4. 服务端使用私钥解析token并检验 -> 检验通过则处理请求, 否则拒绝处理请求

优缺点:
- 不占用服务器内存, 不存在多进程多机器同步问题, 不受跨域影响
- 无法快速封禁登录用户

实现:
- `koa-jwt`
- `jsonwebtoken`

### SSO / OAuth2
二者是包含关系, SSO就是OAuth2(第三方鉴权)的一个应用实例, 常见的第三方鉴权例子: 微信登录, github登录等.

#### 使用cookie实现
若业务系统是在同一主域名下, 如: `x.baidu.com` / `y.baidu.com`, 可直接把cookie domain 设置为主域名 `.baidu.com`即可
```js
// express.js
res.cookie('cookieName', 'cookieValue', { domain: '.example.com' });
```

#### OAuth2
```txt
OAuth2是一种广泛使用的授权框架，使得第三方应用能够获取对用户账户的有限访问权限，而不需要知道用户的用户名和密码。以下是使用OAuth2进行第三方鉴权的主要步骤：

1. 用户首先访问网站A，点击"通过第三方登录"的按钮，然后被重定向到第三方的SSO登录页面。

2. 用户在第三方的SSO登录页面输入用户名和密码，登录成功后，第三方会生成一个授权码，并将这个授权码通过重定向的URL发送回网站A。这个URL通常看起来像这样：`http://websiteA.com/callback?code=AUTHORIZATION_CODE`。

3. 网站A接收到这个重定向请求后，从URL中提取出授权码，并将这个授权码发送给第三方的服务器，请求访问令牌（access token）。

4. 第三方的服务器验证授权码，如果授权码有效，就返回一个访问令牌给网站A。

5. 网站A接收到访问令牌后，就可以使用这个令牌向第三方的服务器请求用户的信息，或者执行其他的操作。

6. 网站A将获取到的访问令牌存储在用户的浏览器中（通常是在cookie中），并用这个令牌作为用户的登录凭证。

以上就是OAuth2鉴权的基本流程。需要注意的是，这个流程可能会因为具体的OAuth2实现或者具体的使用场景有所不同。
```
两个令牌两个阶段:
1. 授权码 -> 授权阶段
2. 访问令牌token -> 认证

> *总结: 其实和使用redis作为第三方缓存服务来解决多进程多服务器之间的缓存数据共享是一样的原理, 简单而言, 由于某些限制, 双方无法直接进行某种通信, 可采用第三方来充当一个中继的媒介来完成*

## 单元测试和接口测试
1. 单元测试库: `jest/mocha`
2. 单元测试为何难以落实
3. supertest测试接口

平铺直叙的代码和逻辑代码拆分
```js
public OrderDTO getUserOrder(HttpRequest request) {
	String userId = request.getParameter("userId");
	String orderId = request.getParameter("orderId");
	UserDTO user = userManager.getUser(userId);
	OrderDTO order = orderManager.getOrder(orderId);
	if (order ！= null && order.getUserId ！= null && order.getUserId.(userId)) {
		order.setUser(user);
		return order;
	}
	return null;
}

// ----------------------------------------------------------------

//平铺直叙的代码不需要单元测试
public OrderDTO getUserOrder(HttpRequest request) {
	String userId = request.getParameter("userId");
	String orderId = request.getParameter("orderId");
	UserDTO user = userManager.getUser(userId);
	OrderDTO order = orderManager.getOrder(orderId);
	return checkUser(order, user, userId);
}
//逻辑单元，单独抽离出来，测试输入输出即可，不用Mock
public OrderDTO checkUser(OrderDTO order, UserDTO user, String userId){
	if (order ！= null && order.getUserId ！= null && order.getUserId.(userId)) {
		order.setUser(user);
		return order;
	}
	return null;
}
```

## pm2 & nginx
线上服务关键: 稳定 + 高效

### pm2
- 稳定: 进程守护
- 高效: 多进程
- 安全: 日志记录, 问题追溯

日志拆分: `pm2-logrotate` 来控制日志文件的大小和数量以便后续的日志查询和定位
```bash
pm2 install pm2-logrotate
```

### nginx
web server 必备利器, 以稳定高效著称
- 静态服务
- 反向代理
- 负载均衡
- access log 访问日志


## 增强项目的开发环境

### eslint
1. install dependencies
```bash
npm install --save-dev eslint-plugin-prettier eslint-config-prettier
npm install --save-dev --save-exact prettier
```
 2. `prettierrc.js` + `eslint.config.mjs`
 3. 如果用的是vscode, 注意 `formatter: prettier` 配置要保持一致, 以免冲突 

### husky
`npm install husky -D`
#### 使用 git hook 在 commit 之前执行 `eslint`
1. `npm i lint-staged -D`
2. package.json
```js
"lint-staged": {
    "*.js": [
      "npm run eslint",
      "npm run eslint/fix"
    ]
  }
```
3. `npx husky init` init and add command to .husky/pre-commit 

#### 使用 git hooke 格式化 commit message 格式
> [docs: commitlint](https://commitlint.js.org/guides/getting-started.html)

1. 安装
```bash
npm install --save-dev @commitlint/{cli,config-conventional}
```

2. 生成配置文件 
```bash
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
```

3. 添加 npm script 并将该script添加到 .husky/commit-msg 中



















## 官方参考文档
- [sequelize](https://sequelize.org/docs/v6/core-concepts/model-basics/#table-name-inference)
- [mongoose](https://mongoosejs.com/docs/search.html?q=time)
- [ioredis](https://redis.github.io/ioredis/classes/Redis.html)