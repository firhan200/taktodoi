import { validate } from "../validation/validation.js";
import {
  loginUserValidation,
  registerUserValidation,
} from "../validation/user-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const countUser = await prismaClient.user.count({
    where: {
      email: user.email,
    },
  });

  if (countUser === 1) {
    throw new ResponseError(400, "Email already registered");
  }

  user.password = await bcrypt.hash(user.password, 10);

  return prismaClient.user.create({
    data: user,
    select: {
      id: true,
      full_name: true,
      email: true,
    },
  });
};

const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);
  const user = await prismaClient.user.findFirst({
    where: {
      email: loginRequest.email,
    },
    select: {
      id: true,
      full_name: true,
      email: true,
      password: true,
    },
  });

  if (!user) {
    throw new ResponseError(401, "Email or password is incorrect");
  }

  const isValidPassword = await bcrypt.compare(
    loginRequest.password,
    user.password
  );

  if (!isValidPassword) {
    throw new ResponseError(401, "Email or password is incorrect");
  }

  const secretKey = process.env.JWT_SECRET_KEY;
  const payload = {
    userId: user.id,
    full_name: user.full_name,
    email: user.email,
  };
  const expiresIn = "1d"; // 1 Day
  const token = jwt.sign(payload, secretKey, { expiresIn: expiresIn });

  return {
    token: token,
  };
};

export default { register, login };
