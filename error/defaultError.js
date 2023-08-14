const { ERROR_CODE_DEFAULT } = require('./error')

class DefaultError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_DEFAULT;
  }
}

module.exports = DefaultError;