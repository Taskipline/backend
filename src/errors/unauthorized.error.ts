import CustomAPIError, { ErrorCode } from "./custom.error";

class UnauthorizedError extends CustomAPIError {
  statusCode = 401;
  code: ErrorCode;

  constructor(
    public message: string,
    code: ErrorCode = ErrorCode.UNAUTHENTICATED
  ) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message, code: this.code }];
  }
}

export default UnauthorizedError;
