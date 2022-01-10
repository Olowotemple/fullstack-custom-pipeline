require('dotenv').config();

const { PORT, NODE_ENV, TEST_MONGODB_URI, SALT_ROUNDS, SECRET } = process.env;

const MONGODB_URI =
  NODE_ENV === 'test' ? TEST_MONGODB_URI : process.env.MONGODB_URI;

module.exports = {
  MONGODB_URI,
  PORT,
  SALT_ROUNDS: +SALT_ROUNDS,
  SECRET,
  NODE_ENV,
};
