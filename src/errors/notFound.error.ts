import CustomAPIError, { ErrorCode } from "./custom.error";

class NotFoundError extends CustomAPIError {
  statusCode: number;
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 404, null);
    this.statusCode = 404;
  }
}

export default NotFoundError;
