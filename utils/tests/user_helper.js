const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const { SALT_ROUNDS } = require('../config');

const initialUsers = [
  {
    username: 'Toby',
    name: 'Tobi Yusuf',
    password: '419',
  },
  {
    username: 'Olowotemple',
    name: 'Temple Olowonigba',
    password: '007',
  },
];

const initDB = async () => {
  await User.deleteMany({});
  const initialUsersToSave = await Promise.all(
    initialUsers.map(async ({ username, name, password }) => ({
      name,
      username,
      passwordHash: await bcrypt.hash(password, SALT_ROUNDS),
    }))
  );
  const promiseArr = initialUsersToSave.map((user) => new User(user).save());
  return await Promise.all(promiseArr);
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialUsers,
  initDB,
  usersInDb,
};
