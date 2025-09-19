import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Taskipline API",
      version: "1.0.0",
      description: `API documentation for the Taskipline backend service, a discipline-focused productivity platform.
      
## Authentication

Most endpoints in this API require authentication using JWT (JSON Web Token). Here's how to authenticate:

1. Obtain an access token by using the \`/auth/signin\`, \`/auth/google\`, or \`/auth/github\` endpoints
2. For protected endpoints, include the token in the Authorization header: \`Authorization: Bearer YOUR_TOKEN\`
3. Tokens expire after a set time period. Use the \`/auth/refresh\` endpoint with your refresh token to obtain a new access token

Public endpoints (like signup, signin, and waitlist) don't require authentication.`,
      contact: {
        name: "Taskipline Support",
        url: "https://github.com/Taskipline/backend/issues",
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "User authentication and authorization operations",
      },
      {
        name: "User Settings",
        description: "Operations for managing user profile and preferences",
      },
      {
        name: "Tasks",
        description: "Task management operations",
      },
      {
        name: "Goals",
        description: "Goal management operations",
      },
      {
        name: "Waitlist",
        description: "Waitlist management operations",
      },
    ],
    servers: [
      {
        url: "/api/v1",
        description: "Development server",
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "JWT token obtained from the /auth/signin or /auth/refresh endpoints. Enter the token without the 'Bearer ' prefix.",
        },
      },
    },
  },
  apis: [
    "./src/routes/*.ts",
    "./src/swagger/schemas.ts",
    "./src/errors/custom.error.ts",
  ],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
