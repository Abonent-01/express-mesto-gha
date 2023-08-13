const { ERROR_CODE_DUPLICATE } = require('./error')

class DuplicateError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_DUPLICATE;
  }
}

module.exports = DuplicateError;