import { validate } from "../validation/validation.js";
import {
  createToDoValidation,
  getToDoValidation,
  updateToDoValidation,
} from "../validation/todo-validation.js";
import { prismaClient } from "../application/database.js";
import { getUserValidation } from "../validation/user-validation.js";
import { ResponseError } from "../error/response-error.js";

const create = async (userId, request) => {
  const todo = await validate(createToDoValidation, request);
  todo.userId = userId;
  return prismaClient.toDo.create({
    data: todo,
    select: {
      id: true,
      name: true,
      description: true,
      userId: true,
    },
  });
};

const checkUserMustExists = async (userId) => {
  userId = validate(getUserValidation, userId);
  const totalUserInDatabase = await prismaClient.user.count({
    where: {
      id: userId,
    },
  });

  if (totalUserInDatabase !== 1) {
    throw new ResponseError(404, "User is not found");
  }

  return userId;
};

const get = async (toDoId, userId) => {
  userId = await checkUserMustExists(userId);
  toDoId = validate(getToDoValidation, toDoId);
  const toDo = await prismaClient.toDo.findFirst({
    where: {
      id: toDoId,
      userId: userId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      userId: true,
    },
  });

  if (!toDo) {
    throw new ResponseError(404, "ToDo is not found");
  }

  return toDo;
};

const list = async (userId) => {
  userId = await checkUserMustExists(userId);
  return prismaClient.toDo.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      userId: true,
    },
  });
};

const update = async (userId, request) => {
  const toDo = validate(updateToDoValidation, request);
  const totalToDoInDatabase = await prismaClient.toDo.count({
    where: {
      id: toDo.id,
      userId: userId,
    },
  });

  if (totalToDoInDatabase !== 1) {
    throw new ResponseError(404, "ToDo is not found");
  }

  return prismaClient.toDo.update({
    where: {
      id: toDo.id,
    },
    data: toDo,
    select: {
      id: true,
      name: true,
      description: true,
      userId: true,
    },
  });
};

const remove = async (userId, toDoId) => {
  userId = validate(getUserValidation, userId);
  toDoId = validate(getToDoValidation, toDoId);

  const totalToDoInDatabase = await prismaClient.toDo.count({
    where: {
      id: toDoId,
      userId: userId,
    },
  });

  if (totalToDoInDatabase !== 1) {
    throw new ResponseError(404, "Todo is not found");
  }

  return prismaClient.toDo.delete({
    where: {
      id: toDoId,
    },
  });
};

export default { create, get, list, update, remove };
