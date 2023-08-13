const { ERROR_CODE_DEFAULT } = require('../error/error')

const errorHandler = (err, req, res, next) => {
  const { statusCode = ERROR_CODE_DEFAULT } = err;
  const message = statusCode  === ERROR_CODE_DEFAULT ? 'Error' : err.message;

  res.status(statusCode).send({ message });
  next();
};

module.exports = errorHandler;