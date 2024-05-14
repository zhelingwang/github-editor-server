const os = require('os');
const cpuCoreLength = os.cpus().length; // CPU几核

/**
 * config: https://pm2.keymetrics.io/docs/usage/application-declaration/
 */
console.log(cpuCoreLength, '---');
module.exports = {
  apps: [
    {
      name: 'editor-server',
      script: 'bin/www',
      // watch: true, // 无特殊情况,不用实时监听文件,否则可能会导致很多restart
      // ignore_watch: ["node_modules", "_test_", "logs"],
      env: {
        NODE_ENV: 'development',
      },
      cwd: './',
      // instances: cpuCoreLength, // 线上环境,多进程
      instances: 1, // 测试环境,一个进程即可
      error_file: './data/log/editor-server/err.log',
      out_file: './data/log/editor-server/out.log',
      log_date_format: 'YYYY—MM—DD HH:mm:ss Z', // Z 表示使用当前时区的时间格式
      combine_logs: true, // 多个实例,合并日志
      max_memory_restart: '300M', // 内存占用超过300M ,则重启
    },
  ],
};
