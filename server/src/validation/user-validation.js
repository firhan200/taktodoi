import Joi from "joi";

const registerUserValidation = Joi.object({
  full_name: Joi.string().max(100).required(),
  email: Joi.string().max(100).required(),
  password: Joi.string().max(100).required(),
});

const loginUserValidation = Joi.object({
  email: Joi.string().max(100).required(),
  password: Joi.string().max(100).required(),
});

const getUserValidation = Joi.number().min(1).positive().required();

export { registerUserValidation, loginUserValidation, getUserValidation };
