import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Taskipline API",
      version: "1.0.0",
      description:
        "API documentation for the Taskipline backend service, a discipline-focused productivity platform.",
      contact: {
        name: "Taskipline Support",
        url: "https://github.com/Taskipline/backend/issues",
      },
    },
    servers: [
      {
        url: "/api/v1",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Path to the API routes
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
