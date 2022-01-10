import { Link } from 'react-router-dom';

const Blog = ({ blog }) => {
  // const removeBlog = async () => {
  //   await deleteBlog(blog);
  // };

  return (
    <li className="Blog">
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} by {blog.author}
      </Link>{' '}
    </li>
  );
};

export default Blog;
