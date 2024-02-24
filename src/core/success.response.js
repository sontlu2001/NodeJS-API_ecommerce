"use strict";
const {StatusCodes,ReasonPhrases} = require('./http.response')

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    metaData = {},
  }) {
    this.message = message ? message : reasonStatusCode;
    this.status = statusCode;
    this.metaData = metaData;
  }

  send(res, header = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metaData }) {
    super({ message, metaData });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    options={},
    statusCode = StatusCodes.CREATED,
    reasonStatusCode = ReasonPhrases.CREATED,
    metaData = {},
  }) {
    super({ message, statusCode, reasonStatusCode, metaData })
    this.options = options
  }
}



module.exports = {
  OK,
  CREATED,
  SuccessResponse
};
