const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BLOGS':
      return action.data;

    case 'ADD_BLOG':
      return state.concat(action.data);

    case 'LIKE_BLOG': {
      const { id, blog } = action.data;
      return state.map((b) => (b.id === id ? blog : b));
    }

    case 'DELETE_BLOG': {
      const id = action.data;
      return state.filter((blog) => blog.id !== id);
    }

    case 'ADD_COMMENT': {
      const commentedBlog = action.data;
      return state.map((blog) =>
        blog.id === commentedBlog.id ? commentedBlog : blog
      );
    }

    default:
      return state;
  }
};

export const createInitBlogs = (blogs) => ({
  type: 'INIT_BLOGS',
  data: blogs,
});

export const createAddBlog = (blog) => ({
  type: 'ADD_BLOG',
  data: blog,
});

export const createLikeBlog = (id, blog) => ({
  type: 'LIKE_BLOG',
  data: {
    id,
    blog,
  },
});

export const createDeleteBlog = (id) => ({
  type: 'DELETE_BLOG',
  data: id,
});

export const createAddComment = (commentedBlog) => {
  console.log('from set-comment creator', commentedBlog);
  return {
    type: 'ADD_COMMENT',
    data: commentedBlog,
  };
};

export default reducer;
