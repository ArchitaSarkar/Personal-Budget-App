import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../index";

describe("API Integration Tests", () => {
  describe("GET /", () => {
    it("should return healthy status message", async () => {
      const response = await request(app).get("/");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Welcome to Finance App Backend",
        status: "healthy",
      });
    });
  });

  describe("Authentication Endpoints Validation", () => {
    it("should reject registration with empty body (400)", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({});

      expect(response.status).toBe(400);
    });

    it("should reject registration with invalid email format (400)", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: "invalid-email-address",
          password: "password123",
        });

      expect(response.status).toBe(400);
    });

    it("should reject login with missing password (400)", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
        });

      expect(response.status).toBe(400);
    });
  });

  describe("Protected Routes Security", () => {
    it("should return 401 Unauthorized when accessing /api/transaction without JWT", async () => {
      const response = await request(app).get("/api/transaction");
      expect(response.status).toBe(401);
    });

    it("should return 401 Unauthorized when accessing /api/user without JWT", async () => {
      const response = await request(app).get("/api/user");
      expect(response.status).toBe(401);
    });

    it("should return 401 Unauthorized when accessing /api/analytics without JWT", async () => {
      const response = await request(app).get("/api/analytics");
      expect(response.status).toBe(401);
    });

    it("should return 401 Unauthorized when accessing /api/report without JWT", async () => {
      const response = await request(app).get("/api/report");
      expect(response.status).toBe(401);
    });
  });
});
