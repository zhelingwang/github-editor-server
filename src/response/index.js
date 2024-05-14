const errorInfo = require('./error');

class Response {
  constructor(code, message, data) {
    this.code = code;
    this.message = message || '';
    this.data = data || null;
  }
}

class SuccessRes extends Response {
  constructor(data) {
    super(0, 'success', data);
  }
}

class ErrorRes extends Response {
  constructor({ code, message }) {
    super(code, message);
  }
}

module.exports = {
  SuccessRes,
  ErrorRes,
  errorInfo,
};
