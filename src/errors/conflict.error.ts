import CustomAPIError, { ErrorCode } from "./custom.error";

class ConflictError extends CustomAPIError {
  statusCode = 409;
  code: ErrorCode;

  constructor(
    public message: string,
    code: ErrorCode = ErrorCode.RESOURCE_CONFLICT
  ) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, ConflictError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message, code: this.code }];
  }
}

export default ConflictError;
