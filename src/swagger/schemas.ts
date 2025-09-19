/**
 * @swagger
 * components:
 *   schemas:
 *     # Core shared schemas used across multiple modules
 *     Error:
 *       type: object
 *       description: |-
 *         Standard error response for the API.
 *         Contains a human-readable message, HTTP status code, and application-specific error code.
 *       properties:
 *         message:
 *           type: string
 *           description: Human-readable error message
 *         statusCode:
 *           type: integer
 *           description: HTTP status code (400, 401, 403, 404, 500, etc.)
 *         code:
 *           type: integer
 *           description: |-
 *             Application-specific error code.
 *             See ErrorCode schema for full reference.
 *
 *     BearerAuth:
 *       type: object
 *       description: |-
 *         # Authentication with Bearer Token
 *
 *         Most API endpoints are protected and require authentication with a JWT bearer token.
 *
 *         ## How to authenticate:
 *         1. Obtain a token through the `/auth/signin`, `/auth/google`, or `/auth/github` endpoints
 *         2. Include the token in the Authorization header of your requests:
 *            `Authorization: Bearer YOUR_ACCESS_TOKEN`
 *         3. When your access token expires, use the refresh token with the `/auth/refresh` endpoint
 *
 *         ## Token format:
 *         - Access tokens are short-lived JWTs (typically 15-60 minutes)
 *         - Refresh tokens are longer-lived tokens for obtaining new access tokens
 *         - Include ONLY the token in the header (no additional text like "Bearer")
 *       properties:
 *         Authorization:
 *           type: string
 *           description: The Authorization header with the Bearer token
 *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTI3Y...
 *
 *     # Base user schema that can be used in different modules
 *     UserBase:
 *       type: object
 *       description: Basic user information returned in most responses
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the user
 *           example: 6127abcdef123456789
 *         firstName:
 *           type: string
 *           description: User's first name
 *           example: John
 *         lastName:
 *           type: string
 *           description: User's last name
 *           example: Doe
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: john.doe@example.com
 *         profilePicture:
 *           type: string
 *           nullable: true
 *           description: URL to user's profile picture (null if not set)
 *           example: https://example.com/images/profile/john-doe.jpg
 */
