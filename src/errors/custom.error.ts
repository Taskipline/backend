// class CustomAPIError extends Error {
//   message: string;
//   errorCode: ErrorCode;
//   statusCode: number;
//   error: unknown;
//   constructor(
//     message: string,
//     errorCode: ErrorCode,
//     statusCode: number,
//     error: unknown
//   ) {
//     super(message);
//     this.message = message;
//     this.errorCode = errorCode;
//     this.statusCode = statusCode;
//     this.error = error;
//   }
// }

// Define the structure for a serialized error
interface SerializedError {
  message: string;
  code: ErrorCode;
  field?: string;
}

// Convert CustomAPIError to an abstract class
export abstract class CustomAPIError extends Error {
  abstract statusCode: number;
  abstract code: ErrorCode;

  constructor(message: string) {
    super(message);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CustomAPIError.prototype);
  }

  // Force subclasses to implement this method
  abstract serializeErrors(): SerializedError[];
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
  BAD_REQUEST = 10002,
  RESOURCE_CONFLICT = 10003,

  // --- Authentication & Authorization (11xxx) ---
  UNAUTHENTICATED = 11000, // User is not logged in
  FORBIDDEN = 11001, // User is logged in but lacks permission
  EMAIL_ALREADY_EXISTS = 11002, // Replaces generic RESOURCE_CONFLICT for signup
  INVALID_CREDENTIALS = 11003,
  INVALID_VERIFICATION_TOKEN = 11004,
  INVALID_RESET_TOKEN = 11005,
  USER_NOT_FOUND = 11006, // Replaces generic NOT_FOUND for user-related operations
  INCORRECT_PASSWORD = 11007,
  USER_NOT_VERIFIED = 11008,
  UNKNOWN_HEADER_SCHEME = 11009, // Added for unknown auth header scheme
  EXPIRED_BEARER_TOKEN = 11010, // Added for expired bearer tokens
  EXPIRED_KALIE_TOKEN = 11011, // Added for expired kalie tokens
  MISSING_REFRESH_TOKEN = 11012, // Added for missing refresh tokens
  ERROR_DECODING_REFRESH_TOKEN = 11013, // Added for errors decoding refresh tokens
  REFRESH_TOKEN_MISMATCH = 11014, // Added for refresh token mismatch
  GOOGLE_AUTH_FAILURE = 11015, // Added for Google OAuth failures
  INCORRECT_PASSWORD_GOOGLE_USER = 11016, // Added for Google user trying to login with password

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
