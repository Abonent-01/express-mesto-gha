const jwt = require('jsonwebtoken');
const ERROR_CODE_AUTH = require('../error/authError');

const auth = (req, res, next) => {
  let token;
  try {
    token = req.cookies.jwt;
  } catch (err) {
    throw new ERROR_CODE_AUTH('Error...');
  }
  let payload;

  try {
    payload = jwt.verify(token, 'SECRET');
  } catch (err) {
    throw new ERROR_CODE_AUTH('Error...');
  }

  req.user = payload;
  next();
}

module.exports = auth;