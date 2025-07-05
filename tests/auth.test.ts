import request from "supertest";
import express from "express";
import { bootstrapExpress } from "../src/loader/app";
import RoleModel from "../src/model/role.model";

describe("Authentication Endpoints", () => {
  let app: express.Express;

  beforeAll(async () => {
    app = express();
    // Only bootstrap Express without database connection
    bootstrapExpress(app);

    // Seed required roles for testing
    await RoleModel.create({
      name: "SUPER_ADMIN",
      permissions: ["all"],
    });
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
        phoneNumber: "123-456-7890",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty(
        "message",
        "Verification email sent"
      );
    });

    it("should fail with invalid email", async () => {
      const userData = {
        name: "Test User",
        email: "invalid-email",
        password: "password123",
        confirmPassword: "password123",
        phoneNumber: "123-456-7890",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
    });

    it("should fail when passwords do not match", async () => {
      const userData = {
        name: "Test User",
        email: "test2@example.com",
        password: "password123",
        confirmPassword: "different-password",
        phoneNumber: "123-456-7890",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should fail to login with non-existent user", async () => {
      const loginData = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(403);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("GET /api/", () => {
    it("should return welcome message", async () => {
      const response = await request(app).get("/api/").expect(200);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("taskipline");
    });
  });
});
