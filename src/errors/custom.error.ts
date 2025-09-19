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
  GITHUB_AUTH_FAILURE = 11017, // Added for Github OAuth failures

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

/**
 * @swagger
 * components:
 *   schemas:
 *     ErrorCode:
 *       type: object
 *       description: |-
 *         # Error Code Reference
 *
 *         This API uses standardized error codes to help with debugging and error handling.
 *         Each error response includes an application-specific error code that provides more
 *         detailed information about the specific error.
 *
 *         ## Error Code Categories
 *
 *         - **10xxx**: General System Errors
 *         - **11xxx**: Authentication & Authorization
 *         - **12xxx**: Waitlist
 *         - **13xxx**: Input Validation
 *         - **14xxx**: Task Management
 *         - **15xxx**: Goal Management
 *       properties:
 *         # --- General System Errors (10xxx) ---
 *         '10000':
 *           type: object
 *           description: INTERNAL_SERVER - Server failed to process the request due to an internal error
 *           properties:
 *             category:
 *               type: string
 *               enum: [System]
 *         '10001':
 *           type: object
 *           description: NOT_FOUND - The requested resource could not be found
 *           properties:
 *             category:
 *               type: string
 *               enum: [System]
 *         '10002':
 *           type: object
 *           description: BAD_REQUEST - Request contains invalid parameters or data
 *           properties:
 *             category:
 *               type: string
 *               enum: [System]
 *         '10003':
 *           type: object
 *           description: RESOURCE_CONFLICT - The resource already exists or conflicts with another resource
 *           properties:
 *             category:
 *               type: string
 *               enum: [System]
 *
 *         # --- Authentication & Authorization (11xxx) ---
 *         '11000':
 *           type: object
 *           description: UNAUTHENTICATED - User is not logged in or session has expired
 *           properties:
 *             category:
 *               type: string
 *               enum: [Authentication]
 *         '11001':
 *           type: object
 *           description: FORBIDDEN - User is logged in but lacks permission for the requested operation
 *           properties:
 *             category:
 *               type: string
 *               enum: [Authorization]
 *         '11002':
 *           type: object
 *           description: EMAIL_ALREADY_EXISTS - Attempting to register with an email that is already in use
 *           properties:
 *             category:
 *               type: string
 *               enum: [Registration]
 *         '11003':
 *           type: object
 *           description: INVALID_CREDENTIALS - Provided login credentials are incorrect
 *           properties:
 *             category:
 *               type: string
 *               enum: [Authentication]
 *         '11004':
 *           type: object
 *           description: INVALID_VERIFICATION_TOKEN - Email verification token is invalid or has expired
 *           properties:
 *             category:
 *               type: string
 *               enum: [Verification]
 *         '11005':
 *           type: object
 *           description: INVALID_RESET_TOKEN - Password reset token is invalid or has expired
 *           properties:
 *             category:
 *               type: string
 *               enum: [PasswordReset]
 *         '11006':
 *           type: object
 *           description: USER_NOT_FOUND - The requested user account does not exist
 *           properties:
 *             category:
 *               type: string
 *               enum: [Authentication]
 *         '11007':
 *           type: object
 *           description: INCORRECT_PASSWORD - The provided password does not match the user's password
 *           properties:
 *             category:
 *               type: string
 *               enum: [Authentication]
 *         '11008':
 *           type: object
 *           description: USER_NOT_VERIFIED - User has not completed email verification process
 *           properties:
 *             category:
 *               type: string
 *               enum: [Verification]
 *         '11009':
 *           type: object
 *           description: UNKNOWN_HEADER_SCHEME - The authorization header contains an unknown scheme
 *           properties:
 *             category:
 *               type: string
 *               enum: [Authentication]
 *         '11010':
 *           type: object
 *           description: EXPIRED_BEARER_TOKEN - The provided bearer token has expired
 *           properties:
 *             category:
 *               type: string
 *               enum: [Authentication]
 *         '11011':
 *           type: object
 *           description: EXPIRED_KALIE_TOKEN - The provided Kalie token has expired
 *           properties:
 *             category:
 *               type: string
 *               enum: [Authentication]
 *         '11012':
 *           type: object
 *           description: MISSING_REFRESH_TOKEN - No refresh token was provided with the request
 *           properties:
 *             category:
 *               type: string
 *               enum: [Authentication]
 *         '11013':
 *           type: object
 *           description: ERROR_DECODING_REFRESH_TOKEN - The refresh token could not be decoded or is malformed
 *           properties:
 *             category:
 *               type: string
 *               enum: [Authentication]
 *         '11014':
 *           type: object
 *           description: REFRESH_TOKEN_MISMATCH - The provided refresh token doesn't match the one stored for this user
 *           properties:
 *             category:
 *               type: string
 *               enum: [Authentication]
 *         '11015':
 *           type: object
 *           description: GOOGLE_AUTH_FAILURE - Failed to authenticate with Google OAuth
 *           properties:
 *             category:
 *               type: string
 *               enum: [Authentication]
 *         '11016':
 *           type: object
 *           description: INCORRECT_PASSWORD_GOOGLE_USER - Google-authenticated user attempted to login with a password
 *           properties:
 *             category:
 *               type: string
 *               enum: [Authentication]
 *         '11017':
 *           type: object
 *           description: GITHUB_AUTH_FAILURE - Failed to authenticate with GitHub OAuth
 *           properties:
 *             category:
 *               type: string
 *               enum: [Authentication]
 *
 *         # --- Waitlist (12xxx) ---
 *         '12001':
 *           type: object
 *           description: WAITLIST_EMAIL_ALREADY_EXISTS - The email address is already registered in the waitlist
 *           properties:
 *             category:
 *               type: string
 *               enum: [Waitlist]
 *
 *         # --- Input Validation (13xxx) ---
 *         '13000':
 *           type: object
 *           description: VALIDATION_ERROR - Input data failed schema validation (typically Zod validation failures)
 *           properties:
 *             category:
 *               type: string
 *               enum: [Validation]
 *
 *         # --- Task Management (14xxx) ---
 *         '14000':
 *           type: object
 *           description: TASK_NOT_FOUND - The requested task does not exist or is not accessible
 *           properties:
 *             category:
 *               type: string
 *               enum: [Task]
 *
 *         # --- Goal Management (15xxx) ---
 *         '15000':
 *           type: object
 *           description: GOAL_NOT_FOUND - The requested goal does not exist or is not accessible
 *           properties:
 *             category:
 *               type: string
 *               enum: [Goal]
 */
