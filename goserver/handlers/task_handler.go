package handlers

import (
	"net/http"
	"time"

	"github.com/firhan200/taktodoi/goserver/data"
	"github.com/firhan200/taktodoi/goserver/dto"
	"github.com/firhan200/taktodoi/goserver/publisher"
	"github.com/firhan200/taktodoi/goserver/utils"
	"github.com/gofiber/fiber/v2"
)

type TaskHandler struct {
	taskData      *data.TaskData
	taskPublisher *publisher.TaskPublisher
}

func NewTaskHandler(td *data.TaskData, tp *publisher.TaskPublisher) *TaskHandler {
	return &TaskHandler{
		taskData:      td,
		taskPublisher: tp,
	}
}

func (th *TaskHandler) GetAll() fiber.Handler {
	type TaskDto struct {
		Id          int       `json:"id"`
		Name        string    `json:"name"`
		Description string    `json:"description"`
		CreatedAt   time.Time `json:"created_at"`
	}

	return func(c *fiber.Ctx) error {
		claim, err := utils.ExtrackToken(c)
		if err != nil {
			return err
		}

		tasks, err := th.taskData.GetByUserId(claim.Id)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		tasksDto := make([]TaskDto, 0)
		for _, task := range tasks {
			tasksDto = append(tasksDto, TaskDto{
				Id:          int(task.ID),
				Name:        task.Name,
				Description: task.Description,
				CreatedAt:   task.CreatedAt,
			})
		}

		return c.Status(http.StatusOK).JSON(tasksDto)
	}
}

func (th *TaskHandler) Create() fiber.Handler {
	type CreateTaskDto struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}

	return func(c *fiber.Ctx) error {
		claim, err := utils.ExtrackToken(c)
		if err != nil {
			return err
		}

		var createTaskDto CreateTaskDto
		if err := c.BodyParser(&createTaskDto); err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		taskId, err := th.taskData.Insert(claim.Id, createTaskDto.Name, createTaskDto.Description)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		//send to queue
		th.taskPublisher.Publish(&dto.CreatedTask{
			Id:          taskId,
			UserId:      claim.Id,
			Name:        createTaskDto.Name,
			Description: createTaskDto.Description,
		})

		return c.Status(http.StatusOK).JSON(fiber.Map{
			"created_id": taskId,
		})
	}
}

func (th *TaskHandler) Update() fiber.Handler {
	type UpdateTaskDto struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}

	type UpdateTaskParams struct {
		Id int `json:"id"`
	}

	return func(c *fiber.Ctx) error {
		claim, err := utils.ExtrackToken(c)
		if err != nil {
			return err
		}

		//parse params
		var (
			updateTaskParams UpdateTaskParams
		)
		if err := c.ParamsParser(&updateTaskParams); err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		//parse json body
		var updateTaskDto UpdateTaskDto
		if err := c.BodyParser(&updateTaskDto); err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		updateErr := th.taskData.Update(updateTaskParams.Id, claim.Id, updateTaskDto.Name, updateTaskDto.Description)
		if updateErr != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": updateErr.Error(),
			})
		}

		return c.JSON(fiber.Map{
			"success": true,
		})
	}
}

func (th *TaskHandler) Delete() fiber.Handler {
	type DeleteTaskParams struct {
		Id int `json:"id"`
	}

	return func(c *fiber.Ctx) error {
		claim, err := utils.ExtrackToken(c)
		if err != nil {
			return err
		}

		//parse params
		var (
			deleteTaskParams DeleteTaskParams
		)
		if err := c.ParamsParser(&deleteTaskParams); err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		deleteErr := th.taskData.Delete(deleteTaskParams.Id, claim.Id)
		if deleteErr != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": deleteErr.Error(),
			})
		}

		return c.JSON(fiber.Map{
			"success": true,
		})
	}
}
