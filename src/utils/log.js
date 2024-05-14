const npmlog = require('npmlog');
const { isProd } = require('./env');
// 修改前缀以及样式
npmlog.heading = '[server]';
npmlog.headingStyle = { fg: 'green', bold: true };

// 根据参数动态设置日志level
npmlog.level = isProd ? 'info' : 'verbose';

// 自定义level方法
npmlog.addLevel('success', 2000, { fg: 'green', bold: true });

module.exports = npmlog;
