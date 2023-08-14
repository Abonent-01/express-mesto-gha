const { ERROR_CODE_WRONG_DATA } = require('./error')

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_WRONG_DATA;
  }
}

module.exports = ValidationError;