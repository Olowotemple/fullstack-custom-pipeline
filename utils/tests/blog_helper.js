const Blog = require('../../models/blog');
const User = require('../../models/user');

const initialBlogs = [
  {
    title: 'How to make scrambled eggs',
    author: 'Jeff Gordons',
    url: 'http://fake-url.com',
    likes: 23,
  },
  {
    title: 'Metaverse, the future?',
    author: 'Satoshi Nakomoto',
    url: 'http://fake-url2035.com',
    likes: 106,
  },
];

const initDB = async () => {
  const user = (await User.findOne({ username: 'Olowotemple' })).toJSON().id;

  await Blog.deleteMany({});
  const promiseArr = initialBlogs.map((blog) => {
    blog.user = user;
    return new Blog(blog).save();
  });
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
