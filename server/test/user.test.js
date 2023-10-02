import supertest from "supertest";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";
import { createUserTest, removeUserTest } from "./test-util.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

// Command to run all test case in this file : npx jest user.test.js
// Command to run specific test case : npx jest user.test.js -t "POST /api/users"
describe("POST /api/users", function () {
  afterEach(async () => {
    await removeUserTest();
  });

  // Command to run specific test case : npx jest user.test.js -t "Should can register new user"
  it("Should can register new user", async () => {
    const result = await supertest(web).post("/api/users").send({
      full_name: "test",
      email: "test@gmail.com",
      password: "testpassword",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.full_name).toBe("test");
    expect(result.body.data.email).toBe("test@gmail.com");
    expect(result.body.data.password).toBeUndefined();
  });

  // Command to run specific test case : npx jest user.test.js -t "Should reject if request is invalid"
  it("Should reject if request is invalid", async () => {
    const result = await supertest(web).post("/api/users").send({
      full_name: "",
      email: "",
      password: "",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  // Command to run specific test case : npx jest user.test.js -t "Should reject if email already registered"
  it("Should reject if email already registered", async () => {
    let result = await supertest(web).post("/api/users").send({
      full_name: "test",
      email: "test@gmail.com",
      password: "testpassword",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.full_name).toBe("test");
    expect(result.body.data.email).toBe("test@gmail.com");
    expect(result.body.data.password).toBeUndefined();

    result = await supertest(web).post("/api/users").send({
      full_name: "test",
      email: "test@gmail.com",
      password: "testpassword",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

// Command to run specific test case : npx jest user.test.js -t "POST /api/users/login"
describe("POST /api/users/login", function () {
  beforeEach(async () => {
    await createUserTest();
  });

  afterEach(async () => {
    await removeUserTest();
  });

  // Command to run specific test case : npx jest user.test.js -t "Should can login"
  it("Should can login", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      email: "test@gmail.com",
      password: "testpassword",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();

    // Extract jwt Payload
    const secret = process.env.JWT_SECRET_KEY;
    const jwtDecode = jwt.verify(result.body.data.token, secret);
    expect(jwtDecode).toBeDefined();
  });

  // Command to run specific test case : npx jest user.test.js -t "Should reject login if request is invalid"
  it("Should reject login if request is invalid", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      email: "",
      password: "",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  // Command to run specific test case : npx jest user.test.js -t "Should reject login if password is incorrect"
  it("Should reject login if password is incorrect", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      email: "test@gmail.com",
      password: "wrongpassword",
    });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  // Command to run specific test case : npx jest user.test.js -t "Should reject login if email is incorrect"
  it("Should reject login if email is incorrect", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      email: "wrong@email.com",
      password: "wrongpassword",
    });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});
