import CustomAPIError, { ErrorCode } from "./custom.error";

class ForbiddenError extends CustomAPIError {
  statusCode = 403;
  code: ErrorCode;

  constructor(
    public message: string,
    code: ErrorCode = ErrorCode.FORBIDDEN
  ) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message, code: this.code }];
  }
}

export default ForbiddenError;
