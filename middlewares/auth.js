const jwt = require('jsonwebtoken');
const ERROR_CODE_AUTH = require('../error/authError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new ERROR_CODE_AUTH('Error...'));
  }

  let payload;

  try {
    payload = jwt.verify(token, 'SECRET');
  } catch (err) {
    return next(new ERROR_CODE_AUTH('Error...'));
  }

  req.user = payload;
  next();
};

module.exports = auth;
