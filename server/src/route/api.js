import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import todoController from "../controller/todo-controller.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

userRouter.post("/api/todos", todoController.create);
userRouter.get("/api/todos/:toDoId", todoController.get);
userRouter.get("/api/todos", todoController.list);
userRouter.patch("/api/todos/:toDoId", todoController.update);
userRouter.delete("/api/todos/:toDoId", todoController.remove);

export { userRouter };
