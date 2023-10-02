import todoService from "../service/todo-service.js";

const create = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const request = req.body;
    const result = await todoService.create(userId, request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const toDoId = req.params.toDoId;
    const result = await todoService.get(toDoId, userId);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const list = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const result = await todoService.list(userId);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const toDoId = req.params.toDoId;
    const request = req.body;
    request.id = toDoId;
    const result = await todoService.update(userId, request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const toDoId = req.params.toDoId;
    await todoService.remove(userId, toDoId);
    res.status(200).json({
      data: "OK",
    });
  } catch (e) {
    next(e);
  }
};

export default { create, get, list, update, remove };
