const { StatusCodes } = require("http-status-codes");

class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class NotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
    // this.message = message;
  }
}

class Unauthenticated extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

class InternalServerError extends Error {
  constructor(Message) {
    super(Message);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}


module.exports = { BadRequest, Unauthenticated, NotFound, InternalServerError };
