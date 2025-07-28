import CustomAPIError, { ErrorCode } from "./custom.error";

class BadRequestError extends CustomAPIError {
  statusCode = 400;
  code: ErrorCode;

  constructor(
    public message: string,
    code: ErrorCode = ErrorCode.BAD_REQUEST
  ) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message, code: this.code }];
  }
}

export default BadRequestError;
