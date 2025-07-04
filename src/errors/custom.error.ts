class CustomAPIError extends Error {
  message: string;
  errorCode: ErrorCode;
  statusCode: number;
  error: any;
  constructor(
    message: string,
    errorCode: ErrorCode,
    statusCode: number,
    error: any
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.error = error;
  }
}

export enum ErrorCode {
  NOT_FOUND = 1001,
  FORBIDDEN = 1003,
  INTERNAL_SERVER = 1005,
  BAD_REQUEST = 1007,
}
export default CustomAPIError;
