import CustomAPIError, { ErrorCode } from "./custom.error";

class BadRequestError extends CustomAPIError {
  statusCode: number;
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 400, null);
    this.statusCode = 400;
  }
}

export default BadRequestError;
