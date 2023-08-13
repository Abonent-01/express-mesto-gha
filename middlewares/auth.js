const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  let token;
  try {
    token = req.cookies.jwt;
  } catch (err) {
    throw new Error('Authentication error: No JWT found in cookies.');
  }

  let payload;
  try {
    payload = jwt.verify(token, 'SECRET');
  } catch (err) {
    throw new Error('Authentication error: Invalid JWT.');
  }

  req.user = payload;
  next();
};

module.exports = auth;
