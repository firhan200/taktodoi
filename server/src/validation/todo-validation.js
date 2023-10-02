import Joi from "joi";

const createToDoValidation = Joi.object({
  name: Joi.string().max(255).required(),
  description: Joi.string().max(255).required(),
});

const getToDoValidation = Joi.number().min(1).positive().required();

const updateToDoValidation = Joi.object({
  id: Joi.number().min(1).positive().required(),
  name: Joi.string().max(255).required(),
  description: Joi.string().max(255).required(),
});

export { createToDoValidation, getToDoValidation, updateToDoValidation };
