import {
  createTestToDo,
  createUserLoginToken,
  createUserTest,
  getPayloadFromToken,
  getTestToDo,
  getTestUser,
  removeAllTestToDos,
  removeUserTest,
} from "./test-util.js";
import supertest from "supertest";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";

// Command to run all test case in this file : npx jest todo.test.js
// Command to run specific test case : npx jest todo.test.js -t "POST /api/todos"
describe("POST /api/todos", function () {
  let token = "";
  beforeEach(async () => {
    await createUserTest();
    token = await createUserLoginToken();
  });

  afterEach(async () => {
    await removeAllTestToDos();
    await removeUserTest();
  });

  // Command to run specific test case : npx jest todo.test.js -t "Should can create new todo"
  it("Should can create new todo", async () => {
    const user = await getPayloadFromToken(token);
    const result = await supertest(web)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "test todo",
        description: "test description",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("test todo");
    expect(result.body.data.description).toBe("test description");
    expect(result.body.data.userId).toBe(user.userId);
  });

  // Command to run specific test case : npx jest todo.test.js -t "Should reject create todo if request is invalid"
  it("Should reject create todo if request is invalid", async () => {
    const result = await supertest(web)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "",
        description: "",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

// Command to run specific test case : npx jest todo.test.js -t "GET /api/todos/:toDoId"
describe("GET /api/todos/:toDoId", function () {
  let token = "";
  beforeEach(async () => {
    await createUserTest();
    token = await createUserLoginToken();
    const user = await getPayloadFromToken(token);
    await createTestToDo(user.userId);
  });

  afterEach(async () => {
    await removeAllTestToDos();
    await removeUserTest();
  });

  // Command to run specific test case : npx jest todo.test.js -t "Should can get todo"
  it("Should can get todo", async () => {
    const toDo = await getTestToDo();
    const result = await supertest(web)
      .get("/api/todos/" + toDo.id)
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(toDo.id);
    expect(result.body.data.name).toBe(toDo.name);
    expect(result.body.data.description).toBe(toDo.description);
    expect(result.body.data.userId).toBe(toDo.userId);
  });

  // Command to run specific test case : npx jest todo.test.js -t "Should reject get todo if todo is not found"
  it("Should reject get todo if todo is not found", async () => {
    const toDo = await getTestToDo();
    const result = await supertest(web)
      .get("/api/todos/" + (toDo.id + 1))
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(404);
  });
});

// Command to run specific test case : npx jest todo.test.js -t "GET /api/todos/"
describe("GET /api/todos/", function () {
  let token = "";
  beforeEach(async () => {
    await createUserTest();
    token = await createUserLoginToken();
    const user = await getPayloadFromToken(token);
    await createTestToDo(user.userId);
  });

  afterEach(async () => {
    await removeAllTestToDos();
    await removeUserTest();
  });

  // Command to run specific test case : npx jest todo.test.js -t "Should can get list todo"
  it("Should can get list todo", async () => {
    const result = await supertest(web)
      .get("/api/todos/")
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(1);
  });
});

// Command to run specific test case : npx jest todo.test.js -t "PATCH /api/todos/:toDoId"
describe("PATCH /api/todos/:toDoId", function () {
  let token = "";
  beforeEach(async () => {
    await createUserTest();
    token = await createUserLoginToken();
    const user = await getPayloadFromToken(token);
    await createTestToDo(user.userId);
  });

  afterEach(async () => {
    await removeAllTestToDos();
    await removeUserTest();
  });

  // Command to run specific test case : npx jest todo.test.js -t "Should can update existing todo"
  it("Should can update existing todo", async () => {
    const user = await getPayloadFromToken(token);
    const toDo = await getTestToDo();
    const result = await supertest(web)
      .patch("/api/todos/" + toDo.id)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "dummy todo",
        description: "dummy description",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("dummy todo");
    expect(result.body.data.description).toBe("dummy description");
    expect(result.body.data.userId).toBe(user.userId);
  });

  // Command to run specific test case : npx jest todo.test.js -t "Should reject update todo if request is invalid"
  it("Should reject update todo if request is invalid", async () => {
    const toDo = await getTestToDo();
    const result = await supertest(web)
      .patch("/api/todos/" + toDo.id)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "",
        description: "",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  // Command to run specific test case : npx jest todo.test.js -t "Should reject update todo if todo is not found"
  it("Should reject update todo if todo is not found", async () => {
    const toDo = await getTestToDo();
    const result = await supertest(web)
      .patch("/api/todos/" + (toDo.id + 1))
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "dummy todo",
        description: "dummy description",
      });

    expect(result.status).toBe(404);
  });
});

// Command to run specific test case : npx jest todo.test.js -t "DELETE /api/todos/:toDoId"
describe("DELETE /api/todos/:toDoId", function () {
  let token = "";
  beforeEach(async () => {
    await createUserTest();
    token = await createUserLoginToken();
    const user = await getPayloadFromToken(token);
    await createTestToDo(user.userId);
  });

  afterEach(async () => {
    await removeAllTestToDos();
    await removeUserTest();
  });

  // Command to run specific test case : npx jest todo.test.js -t "Should can delete todo"
  it("Should can delete todo", async () => {
    let toDo = await getTestToDo();
    const result = await supertest(web)
      .delete("/api/todos/" + toDo.id)
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    toDo = await getTestToDo();
    expect(toDo).toBeNull();
  });

  // Command to run specific test case : npx jest todo.test.js -t "Should reject delete todo if todo is not found"
  it("Should reject delete todo if todo is not found", async () => {
    let toDo = await getTestToDo();
    const result = await supertest(web)
      .delete("/api/todos/" + (toDo.id + 1))
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(404);
  });
});
