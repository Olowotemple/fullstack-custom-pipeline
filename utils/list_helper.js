const dummy = () => 1;

const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => acc + blog.likes, 0);
};

const favouriteBlog = (blogs) => {
  let max = 0;
  return blogs.reduce((acc, blog) => {
    if (blog.likes > max) {
      max = blog.likes;
      acc = { ...blog };
    }
    return acc;
  }, {});
};

const mostBlogs = (blogs) => {
  let max = 0;
  return blogs
    .reduce((acc, curr) => {
      const blog = acc.find((blog) => blog.author === curr.author);
      if (blog) {
        blog.blogs++;
      } else {
        acc.push({ author: curr.author, blogs: 1 });
      }
      return acc;
    }, [])
    .reduce((acc, curr) => {
      if (curr.blogs > max) {
        max = curr.blogs;
        acc = curr;
      }
      return acc;
    }, {});
};

const mostLikes = (blogs) => {
  let max = 0;
  return blogs
    .reduce((acc, curr) => {
      const blog = acc.find((blog) => blog.author === curr.author);
      if (blog) {
        blog.likes += curr.likes;
      } else {
        acc.push({ author: curr.author, likes: curr.likes });
      }
      return acc;
    }, [])
    .reduce((acc, curr) => {
      if (curr.likes > max) {
        max = curr.likes;
        acc = curr;
      }
      return acc;
    }, {});
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};
