import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from 'react-router-dom';
import Blog from './components/Blog';
import Notification from './components/Notification';
import Toggable from './components/Toggable';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';
import blogService from './services/blogs';
import loginService from './services/login';
import {
  createRemoveNotification,
  createSetNotification,
} from './reducers/notificationReducer';
import {
  createAddBlog,
  createAddComment,
  createDeleteBlog,
  createInitBlogs,
  createLikeBlog,
} from './reducers/blogReducer';
import { createSetUser } from './reducers/userReducer';

const App = () => {
  const user = useSelector((state) => state.user);
  const blogFormRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const blogs = (await blogService.getAll()).sort(
        (blogA, blogB) => blogB.likes - blogA.likes
      );
      dispatch(createInitBlogs(blogs));
    })();
  }, []);

  useEffect(() => {
    const loggedInUser = JSON.parse(
      window.localStorage.getItem('loggedInBlogAppUser')
    );

    if (loggedInUser) {
      dispatch(createSetUser(loggedInUser));
    }
  }, []);

  const deleteBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.deleteBlog(blog.id, user.token);
      dispatch(createDeleteBlog(blog.id));
    }
  };

  const increaseLikes = async (id, blogObject) => {
    const blog = await blogService.update(id, blogObject);
    dispatch(createLikeBlog(id, blog));
  };

  const handleLogin = async (personObject) => {
    try {
      const user = await loginService.login(personObject);
      window.localStorage.setItem('loggedInBlogAppUser', JSON.stringify(user));
      dispatch(createSetUser(user));

      dispatch(
        createSetNotification({
          type: 'success',
          msg: `Welcome ${user.name.split(' ')[0]}`,
        })
      );
      setTimeout(() => {
        dispatch(createRemoveNotification());
      }, 5000);
    } catch (err) {
      dispatch(
        createSetNotification({ type: 'error', msg: err.response.data.error })
      );
      setTimeout(() => {
        dispatch(createRemoveNotification());
      }, 5000);
    }
  };

  const addBlog = async (blogObj) => {
    const blog = await blogService.create(blogObj, user.token);
    dispatch(createAddBlog(blog));
    dispatch(
      createSetNotification({
        type: 'success',
        msg: `${blog.title} by ${blog.author} added`,
      })
    );
    setTimeout(() => {
      dispatch(createRemoveNotification());
    }, 5000);
    blogFormRef.current.toggleVisibility();
  };

  if (!user) {
    return (
      <div className="App">
        <h1>blog.app</h1>
        <Notification
          successStyle={{
            color: 'green',
            background: 'lightgrey',
            fontSize: 20,
            borderStyle: 'solid',
            borderRadius: 5,
            padding: 10,
            marginBottom: 10,
          }}
          errorStyle={{
            color: 'red',
            background: 'lightgrey',
            fontSize: 20,
            borderStyle: 'solid',
            borderRadius: 5,
            padding: 10,
            marginBottom: 10,
          }}
        />
        <LoginForm handleLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="App">
      <Router>
        <Menu />
        <h1>/blog.app/</h1>

        <Notification
          successStyle={{
            color: 'green',
            background: 'lightgrey',
            fontSize: 20,
            borderStyle: 'solid',
            borderRadius: 5,
            padding: 10,
            marginBottom: 10,
          }}
          errorStyle={{
            color: 'red',
            background: 'lightgrey',
            fontSize: 20,
            borderStyle: 'solid',
            borderRadius: 5,
            padding: 10,
            marginBottom: 10,
          }}
        />

        <Routes>
          <Route path="/">
            <Route
              index
              element={
                <Home
                  blogFormRef={blogFormRef}
                  increaseLikes={increaseLikes}
                  deleteBlog={deleteBlog}
                  addBlog={addBlog}
                />
              }
            />
            <Route path="users">
              <Route index element={<Users />} />
              <Route path=":userId" element={<User />} />
            </Route>
            <Route path="blogs">
              <Route
                path=":blogId"
                element={<Blogview increaseLikes={increaseLikes} />}
              />
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;

const Home = ({ addBlog, blogFormRef, increaseLikes, deleteBlog }) => {
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);

  return (
    <div className="Home">
      <Toggable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm addBlog={addBlog} />
      </Toggable>

      <ol className="blogs">
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            increaseLikes={increaseLikes}
            deleteBlog={deleteBlog}
            username={user.username}
          />
        ))}
      </ol>
    </div>
  );
};

const Users = () => {
  const blogsByUser = useSelector((state) =>
    state.blogs.reduce((acc, curr) => {
      const blog = acc.find((blog) => blog.user.name === curr.user.name);
      if (blog) {
        blog.blogs++;
      } else {
        acc.push({ user: curr.user, blogs: 1 });
      }
      return acc;
    }, [])
  );

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <td></td>
            <td>
              <b>blogs created</b>
            </td>
          </tr>
        </thead>

        <tbody>
          {blogsByUser.map((blogByUser) => {
            return (
              <tr key={blogByUser.user.id}>
                <td>
                  <Link to={`/users/${blogByUser.user.id}`}>
                    {blogByUser.user.name}
                  </Link>
                </td>
                <td>{blogByUser.blogs}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const User = () => {
  const { userId } = useParams();
  const blogsForUser = useSelector((state) =>
    state.blogs.filter((blog) => blog.user.id === userId)
  );

  if (!blogsForUser.length) {
    return null;
  }

  const user = blogsForUser[0].user;
  return (
    <div>
      <h2>{user.name}</h2>

      <h3>added blogs</h3>

      <ul>
        {blogsForUser.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

const Blogview = ({ increaseLikes }) => {
  const [comment, setComment] = useState('');
  const { blogId } = useParams();
  const blog = useSelector(
    (state) => state.blogs.filter((blog) => blog.id === blogId)[0]
  );
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  if (!blog) {
    return null;
  }

  const handleClick = async () => {
    await increaseLikes(blog.id, { ...blog, likes: blog.likes + 1 });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const blog = await blogService.addComment(blogId, comment, user.token);
    dispatch(createAddComment(blog));
    setComment('');
  };

  return (
    <div className="Blogview">
      <h1>{blog.title}</h1>
      <a href={blog.url}>{blog.url}</a>
      <p>
        {blog.likes} likes{' '}
        <button onClick={handleClick} id="like">
          like
        </button>
      </p>
      <p>
        <i>authored by {blog.author}</i>
      </p>

      <div className="comments">
        <form onSubmit={handleSubmit} className="comment">
          <div>
            <input
              id="comment"
              value={comment}
              onChange={(evt) => setComment(evt.target.value)}
            />
          </div>
          <button id="add-comment">add comment</button>
        </form>
        <h2>comments</h2>
        <ul>
          {blog.comments.map((comment) => (
            <li key={comment}>{comment}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Menu = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInBlogAppUser');
    dispatch(createSetUser(null));
  };

  return (
    <ul className="nav">
      <li className="nav__item">
        <Link to="/" className="nav__link">
          blogs
        </Link>
      </li>
      <li className="nav__item">
        <Link to="/users" className="nav__link">
          users
        </Link>
      </li>
      <li className="nav__item">
        {user ? (
          <div>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </div>
        ) : (
          <Link to="/login" className="nav__link">
            login
          </Link>
        )}
      </li>
    </ul>
  );
};
