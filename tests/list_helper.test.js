const {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
} = require('../utils/list_helper');

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

test('dummy returns one', () => {
  const blogs = [];
  expect(dummy(blogs)).toBe(1);
});

describe('total likes', () => {
  test('of empty list is zero', () => {
    expect(totalLikes([])).toBe(0);
  });

  test('when list has only one blog, equals the likes of that', () => {
    expect(totalLikes([blogs[0]])).toBe(blogs[0].likes);
  });

  test('of a bigger list is calculated right', () => {
    expect(totalLikes(blogs)).toBe(
      blogs.reduce((acc, blog) => acc + blog.likes, 0)
    );
  });
});

describe('favourite blog', () => {
  test('of empty list is {}', () => {
    expect(favouriteBlog([])).toEqual({});
  });

  test('when list has only one blog', () => {
    expect(favouriteBlog([blogs[0]])).toEqual(blogs[0]);
  });

  test('when list has more than a blog', () => {
    expect(favouriteBlog(blogs)).toEqual(blogs[2]);
  });
});

describe('author with the most blogs', () => {
  test('of empty list is {}', () => {
    expect(mostBlogs([])).toEqual({});
  });

  test('when list has only one blog', () => {
    expect(mostBlogs([blogs[0]])).toEqual({
      author: blogs[0].author,
      blogs: 1,
    });
  });

  test('when list has more than a blog', () => {
    expect(mostBlogs(blogs)).toEqual({
      author: 'Robert C. Martin',
      blogs: 3,
    });
  });
});

describe('author with the most likes', () => {
  test('of empty list is {}', () => {
    expect(mostLikes([])).toEqual({});
  });

  test('when list has only one blog', () => {
    expect(mostLikes([blogs[0]])).toEqual({
      author: blogs[0].author,
      likes: blogs[0].likes,
    });
  });

  test('when list has more than a blog', () => {
    expect(mostLikes(blogs)).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17,
    });
  });
});
