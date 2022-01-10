const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const {
  initDB,
  initialUsers,
  usersInDb,
} = require('../utils/tests/user_helper');

const api = supertest(app);

beforeEach(async () => {
  await initDB();
});

describe('to create a new user', () => {
  const baseURL = '/api/users';

  test('a valid user is saved', async () => {
    const user = {
      username: 'Njideka',
      name: 'Ciroma Chioma',
      password: 'njideka',
    };

    const saveRes = await api.post(baseURL).send(user);
    const savedUser = saveRes.body;
    expect(saveRes.status).toEqual(200);
    expect(savedUser.name).toBeDefined();
    expect(savedUser.username).toBeDefined();
    expect(savedUser.passwordHash).not.toBeDefined();

    const users = await usersInDb();
    expect(users).toHaveLength(initialUsers.length + 1);
  });

  test('user with no username or with username less than three characters will not be created', async () => {
    const user = {
      name: 'test123',
      password: 'error-out',
    };

    const saveRes = await api.post(baseURL).send(user);
    expect(saveRes.status).toEqual(400);
    expect(saveRes.body).toStrictEqual({
      error: 'username is required and should be min of 3 characters',
    });
    const users = await usersInDb();
    expect(users).toHaveLength(users.length);
  });

  test('user with no password ow with password less than 3 characters will not be created', async () => {
    const user = {
      name: 'test123',
      username: 'root-test',
    };

    const saveRes = await api.post(baseURL).send(user);
    expect(saveRes.status).toEqual(400);
    expect(saveRes.body).toStrictEqual({
      error: 'password is required and should be min of 3 characters',
    });
    const users = await usersInDb();
    expect(users).toHaveLength(users.length);
  });

  test('username should be unique', async () => {
    const user = {
      username: 'Olowotemple',
      name: 'Ciroma Chioma',
      password: 'njideka',
    };

    const res = await api.post(baseURL).send(user);
    expect(res.status).toEqual(400);
    expect(res.body).toStrictEqual({
      error:
        'User validation failed: username: Error, expected `username` to be unique. Value: `Olowotemple`',
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
