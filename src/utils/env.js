const ENV = process.env.NODE_ENV || '';

module.exports = {
  ENV,
  isProd: ENV === 'production',
  isTest: ENV === 'test',
  isDev: ENV === 'development',
};
