import { CustomAPIError, ErrorCode } from "./custom.error";

class NotFoundError extends CustomAPIError {
  statusCode = 404;
  code: ErrorCode;

  constructor(
    public message: string,
    code: ErrorCode = ErrorCode.NOT_FOUND
  ) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message, code: this.code }];
  }
}

export default NotFoundError;
