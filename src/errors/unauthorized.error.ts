import CustomAPIError, { ErrorCode } from "./custom.error";

class UnauthorizedError extends CustomAPIError {
  statusCode: number;
  constructor(
    message: string,
    errorCode: ErrorCode = ErrorCode.UNAUTHENTICATED
  ) {
    super(message, errorCode, 401, null);
    this.statusCode = 401;
  }
}

export default UnauthorizedError;
