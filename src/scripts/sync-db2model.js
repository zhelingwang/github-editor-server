/**
 * Automatically generate models for SequelizeJS via the command line.
 * eg:
 * original script:
 * 		sequelize-auto -o "./src/db/models" -d test -h localhost -u root -p 3306 -x root -t demo
 * npm script:
 * 		npm run sequelize:prod -- -t demo
 */
const { spawn } = require('child_process');
const { mysqlConf } = require('../config');
const { program } = require('commander');

program
  .name('sequelize-auto')
  .usage('--table tableName')
  .description(
    'Automatically generate models for SequelizeJS via the command line.',
  )
  .requiredOption('-t, --table <tableName...>', 'must have tableName');
program.parse(process.argv);
const { table } = program.opts();

/**
 * child_process.spawn 兼容window系统才能使用统一的调用写法
 * macOS: child_process.spawn("sequelize-auto", [xxx])
 * window: child_process.spawn("cmd", ['/c', 'sequelize-auto', xxx])
 * @param {*} command
 * @param {*} args
 * @param {*} options
 * @returns
 */
function _spawn(command, args, options) {
  const isWindow = process.platform === 'win32';
  args = isWindow ? ['/c', command, ...args] : args;
  command = isWindow ? 'cmd' : command;
  return spawn(command, args, options);
}

function syncModels() {
  const ls = _spawn(
    'sequelize-auto',
    [
      '-e',
      'mysql',
      '-o',
      './src/db/models',
      '-d',
      mysqlConf.database,
      '-h',
      mysqlConf.host,
      '-u',
      mysqlConf.user,
      '-x',
      mysqlConf.password,
      '-p',
      mysqlConf.port,
      '-t',
      table,
      '--noInitModels', // 不自动生成 init-models file
      true,
    ],
    {
      cwd: process.cwd(),
      stdio: 'inherit',
    },
  );
  ls.on('error', (err) => {
    console.log(`error: ${err}`);
  });
  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

syncModels();
