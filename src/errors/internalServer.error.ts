import CustomAPIError, { ErrorCode } from "./custom.error";

class InternalServerError extends CustomAPIError {
  statusCode = 500;
  code: ErrorCode;

  constructor(
    public message: string,
    code: ErrorCode = ErrorCode.INTERNAL_SERVER
  ) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message, code: this.code }];
  }
}

export default InternalServerError;
