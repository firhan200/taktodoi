package handlers

import (
	"net/http"

	"github.com/firhan200/taktodoi/goserver/data"
	"github.com/firhan200/taktodoi/goserver/utils"
	"github.com/gofiber/fiber/v2"
)

type TaskHandler struct {
	taskData *data.TaskData
}

func NewTaskHandler(td *data.TaskData) *TaskHandler {
	return &TaskHandler{
		taskData: td,
	}
}

func (th *TaskHandler) GetAll() fiber.Handler {
	return func(c *fiber.Ctx) error {
		claim, err := utils.ExtrackToken(c)
		if err != nil {
			return err
		}

		return c.Status(http.StatusOK).JSON(claim)
	}
}

func (th *TaskHandler) Create() fiber.Handler {
	type CreateTaskDto struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}

	return func(c *fiber.Ctx) error {
		var createTaskDto CreateTaskDto
		if err := c.BodyParser(&createTaskDto); err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		taskId, err := th.taskData.Insert(1, createTaskDto.Name, createTaskDto.Description)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.Status(http.StatusOK).JSON(fiber.Map{
			"created_id": taskId,
		})
	}
}

func (th *TaskHandler) Update() fiber.Handler {
	return func(c *fiber.Ctx) error {
		return nil
	}
}

func (th *TaskHandler) Delete() fiber.Handler {
	return func(c *fiber.Ctx) error {
		return nil
	}
}
