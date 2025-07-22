class CustomAPIError extends Error {
  message: string;
  errorCode: ErrorCode;
  statusCode: number;
  error: unknown;
  constructor(
    message: string,
    errorCode: ErrorCode,
    statusCode: number,
    error: unknown
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.error = error;
  }
}

// export enum ErrorCode {
//   NOT_FOUND = 10001,
//   FORBIDDEN = 10002,
//   INTERNAL_SERVER = 10003,
//   BAD_REQUEST = 10004,
//   RESOURCE_CONFLICT = 10005,
// }
/**
 * Custom application-specific error codes.
 * Grouped by feature for clarity and scalability.
 *
 * - 10xxx: General System Errors
 * - 11xxx: Authentication & Authorization
 * - 12xxx: Waitlist
 * - 13xxx: Input Validation
 * - 30xxx: Task Management (Future)
 */
export enum ErrorCode {
  // --- General System Errors (10xxx) ---
  INTERNAL_SERVER = 10000,
  NOT_FOUND = 10001,

  // --- Authentication & Authorization (11xxx) ---
  UNAUTHENTICATED = 11000, // User is not logged in
  FORBIDDEN = 11001, // User is logged in but lacks permission
  EMAIL_ALREADY_EXISTS = 11002, // Replaces generic RESOURCE_CONFLICT for signup
  INVALID_CREDENTIALS = 11003,
  INVALID_VERIFICATION_TOKEN = 11004,
  INVALID_RESET_TOKEN = 11005,
  USER_NOT_FOUND = 11006, // Replaces generic NOT_FOUND for user-related operations

  // --- Waitlist (12xxx) ---
  WAITLIST_EMAIL_ALREADY_EXISTS = 12001, // Replaces generic RESOURCE_CONFLICT for waitlist

  // --- Input Validation (13xxx) ---
  VALIDATION_ERROR = 13000, // Replaces generic BAD_REQUEST for Zod validation failures

  // --- Task Management (14xxx) ---
  TASK_NOT_FOUND = 14000, // Replaces generic NOT_FOUND for task-related operations

  // --- Goal Management (15xxx) ---
  GOAL_NOT_FOUND = 15000, // Replaces generic NOT_FOUND for goal-related
}

export default CustomAPIError;
