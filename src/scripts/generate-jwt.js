const { signJwt } = require('../utils/jwt');

function run() {
  const token = signJwt({
    name: 'alltoowell',
  });
  console.log('token: ', token);
}

run();
