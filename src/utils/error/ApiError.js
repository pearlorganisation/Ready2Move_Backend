class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "Api Error";
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
