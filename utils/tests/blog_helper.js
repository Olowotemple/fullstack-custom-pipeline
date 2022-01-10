const Blog = require('../../models/blog');

const initialBlogs = [
  {
    title: 'How to make scrambled eggs',
    author: 'Jeff Gordons',
    url: 'http://fake-url.com',
    likes: 23,
    user: '6198e861d0c95b10bda01165',
  },
  {
    title: 'Metaverse, the future?',
    author: 'Satoshi Nakomoto',
    url: 'http://fake-url2035.com',
    likes: 106,
    user: '6198e861d0c95b10bda01165',
  },
];

const initDB = async () => {
  await Blog.deleteMany({});
  const promiseArr = initialBlogs.map((blog) => new Blog(blog).save());
  await Promise.all(promiseArr);
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  initDB,
  blogsInDb,
};
