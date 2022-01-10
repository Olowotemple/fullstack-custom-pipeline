const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const middleware = require('../utils/middleware');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user');
  response.json(blogs);
});

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body;

  if (!title || !url) {
    return response.status(400).end();
  }

  const user = (await User.findById(request.user.id)).toJSON();

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user.id,
  });

  const savedBlog = await blog.save();
  response.json(savedBlog);
});

blogRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const { id } = request.params;
    const { token, user } = request;
    if (!token) {
      return response.status(401).json({ error: 'missing token' });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return response.status(404).end();
    }

    if (!user || user.id !== blog.user.toString()) {
      return response.status(401).json({ error: 'invalid token' });
    }

    if (user.id === blog.user.toString()) {
      await Blog.findByIdAndDelete(blog.id);
      return response.status(204).end();
    }
  }
);

blogRouter.put('/:id', async (request, response) => {
  const { id } = request.params;
  const res = await Blog.findByIdAndUpdate(id, request.body, { new: true });
  response.json(res);
});

blogRouter.post('/:id/comments', middleware.userExtractor, async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  const blog = await Blog.findById(id);

  blog.comments.push(comment);
  const popRes = await (await blog.save()).populate('user');
  res.json(popRes);
});

module.exports = blogRouter;
