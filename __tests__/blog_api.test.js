const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const blogHelper = require('../utils/tests/blog_helper');
const userHelper = require('../utils/tests/user_helper');

const api = supertest(app);
let token;

beforeAll(async () => {
  await userHelper.initDB();
  const baseURL = '/api/login';
  const res = await api.post(`${baseURL}`).send({
    username: 'Olowotemple',
    password: '007',
  });

  token = res.body.token;
});

beforeEach(async () => {
  await blogHelper.initDB();
});

describe('GET blogs', () => {
  const baseURL = '/api/blogs';

  test('all blogs are returned', async () => {
    const res = await api.get(baseURL);
    expect(res.body).toHaveLength(blogHelper.initialBlogs.length);
  });

  test('blogs are returned in JSON format', async () => {
    await api
      .get(baseURL)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('unique identifier is named id', async () => {
    const res = await api.get(baseURL);
    const blog = res.body[0];
    expect(blog.id).toBeDefined();
  });
});

describe('POST blogs', () => {
  const baseURL = '/api/blogs';

  test('a new blog post can be created', async () => {
    const blog = {
      title: 'Your Introduction to web 3.0',
      author: 'Catalin Pit',
      url: 'http://fake-url3a7a1.com',
      likes: 292,
    };

    await api.post(baseURL).set('Authorization', `Bearer ${token}`).send(blog);

    const blogs = await blogHelper.blogsInDb();
    const blogTitles = blogs.map((blog) => blog.title);
    expect(blogs).toHaveLength(blogHelper.initialBlogs.length + 1);
    expect(blogTitles).toContain('Your Introduction to web 3.0');
  });

  test('likes defaults to 0', async () => {
    const blog = {
      title: 'Your Introduction to web 3.0',
      author: 'Catalin Pit',
      url: 'http://fake-url3a7a1.com',
    };

    const res = await api
      .post(baseURL)
      .set('Authorization', `Bearer ${token}`)
      .send(blog);

    expect(res.body.likes).toBeDefined();
    expect(res.body.likes).toEqual(0);
  });

  test('No title results in 400 Bad request', async () => {
    const blog = {
      author: 'Catalin Pit',
      url: 'http://fake-url3a7a1.com',
    };

    const res = await api
      .post(baseURL)
      .set('Authorization', `Bearer ${token}`)
      .send(blog);
    expect(res.status).toEqual(400);
  });

  test('No url results in 400 Bad request', async () => {
    const blog = {
      title: 'Your Introduction to web 3.0',
      author: 'Catalin Pit',
    };

    const res = await api
      .post(baseURL)
      .set('Authorization', `Bearer ${token}`)
      .send(blog);
    expect(res.status).toEqual(400);
  });

  test('adding a blog without a token fails', async () => {
    const blog = {
      title: 'Your Introduction to web 3.0',
      author: 'Catalin Pit',
    };

    const res = await api.post(baseURL).send(blog);
    expect(res.status).toEqual(401);
  });
});

describe('DELETE blogs', () => {
  test('a single blog post can be deleted', async () => {
    const blogToDelete = (await api.get('/api/blogs')).body[0];

    const deleteRes = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(deleteRes.status).toEqual(204);

    const blogs = await blogHelper.blogsInDb();
    expect(blogs).toHaveLength(blogHelper.initialBlogs.length - 1);

    const blogTitles = blogs.map((blog) => blog.title);
    expect(blogTitles).not.toContain(blogToDelete.title);
  });
});

describe('PUT blogs', () => {
  test('a single blog post can be updated', async () => {
    const res = await api.get('/api/blogs');
    const blogs = res.body;
    const blogToUpdate = blogs[0];

    const updateRes = await api.put(`/api/blogs/${blogToUpdate.id}`).send({
      title: 'Feathering Storms',
      author: 'Charone Chaperone',
      url: 'http://fakeasf-url#2.com',
      likes: 7,
    });
    expect(updateRes.status).toEqual(200);

    const getAllRes = await api.get('/api/blogs');
    const blogsAtEnd = getAllRes.body;
    const blogTitles = blogsAtEnd.map((blog) => blog.title);
    expect(blogTitles).not.toContain(blogToUpdate.title);
    expect(blogTitles).toContain(updateRes.body.title);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
