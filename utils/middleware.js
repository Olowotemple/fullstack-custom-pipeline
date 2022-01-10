const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('Authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7);
  } else {
    req.token = null;
  }
  next();
};

const userExtractor = (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: 'missing token' });
  }
  const user = jwt.verify(req.token, SECRET);
  req.user = user || null;

  next();
};

module.exports = {
  tokenExtractor,
  userExtractor,
};
