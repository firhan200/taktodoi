import { prismaClient } from "../src/application/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { logger } from "../src/application/logging.js";

export const removeUserTest = async () => {
  await prismaClient.user.deleteMany({
    where: {
      full_name: "test",
    },
  });
};

export const createUserTest = async () => {
  await prismaClient.user.create({
    data: {
      email: "test@gmail.com",
      full_name: "test",
      password: await bcrypt.hash("testpassword", 10),
    },
  });
};

export const removeAllTestToDos = async () => {
  await prismaClient.toDo.deleteMany({
    where: {
      user: {
        full_name: "test",
      },
    },
  });
};

export const getTestUser = async () => {
  let user = await prismaClient.user.findFirst({
    where: {
      full_name: "test",
    },
  });
  user.original_password = "testpassword";
  return user;
};

export const createUserLoginToken = async () => {
  const user = await getTestUser();
  const secretKey = process.env.JWT_SECRET_KEY;
  const payload = {
    userId: user.id,
    full_name: user.full_name,
    email: user.email,
  };
  const expiresIn = "1d"; // 1 Day
  const token = jwt.sign(payload, secretKey, { expiresIn: expiresIn });

  return token;
};

export const getPayloadFromToken = async (token) => {
  const secret = process.env.JWT_SECRET_KEY;
  try {
    const jwtDecode = jwt.verify(token, secret);
    return jwtDecode;
  } catch (e) {
    const result = {
      error: e,
      message: "Unauthorized",
    };
    return result;
  }
};

export const createTestToDo = async (userId) => {
  await prismaClient.toDo.create({
    data: {
      name: "test todo",
      description: "test description",
      userId: userId,
    },
  });
};

export const getTestToDo = async () => {
  return prismaClient.toDo.findFirst({
    where: {
      name: "test todo",
    },
  });
};
