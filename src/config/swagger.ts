import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Taskipline Backend API",
      version: "1.0.0",
      description:
        "API documentation for Taskipline backend service - Building discipline with taskipline! 🦄🌈✨",
      contact: {
        name: "Emmy-Akintz",
        url: "https://github.com/Taskipline/backend",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            _id: {
              type: "string",
              description: "User ID",
            },
            name: {
              type: "string",
              description: "User full name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
            },
            phoneNumber: {
              type: "string",
              description: "User phone number",
            },
            isActive: {
              type: "boolean",
              description: "Whether user account is activated",
            },
            role: {
              $ref: "#/components/schemas/Role",
            },
          },
        },
        Role: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Role ID",
            },
            name: {
              type: "string",
              description: "Role name",
            },
            permissions: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of permissions",
            },
            grantAll: {
              type: "boolean",
              description: "Whether role grants all permissions",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              description: "Error message",
            },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              description: "Success message",
            },
          },
        },
      },
    },
  },
  apis: ["./src/api/*.ts", "./src/controller/**/*.ts"], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Taskipline API Documentation",
    })
  );

  // Swagger JSON endpoint
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });
};

export default specs;
