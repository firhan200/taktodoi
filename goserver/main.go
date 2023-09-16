package main

import (
	"github.com/firhan200/taktodoi/goserver/data"
	"github.com/firhan200/taktodoi/goserver/handlers"
	"github.com/gofiber/fiber/v2"
)

func main() {
	db := data.NewDB()
	db.Migrate()
	taskData := data.NewTask(db.Conn)
	taskHandler := handlers.NewTaskHandler(taskData)
	userData := data.NewUser(db.Conn)
	userHandler := handlers.NewUserHandler(userData)

	app := fiber.New()

	auth := app.Group("/auth")
	auth.Post("/register", userHandler.Register())

	tasks := app.Group("/tasks")
	tasks.Get("/", taskHandler.GetAll())
	tasks.Post("/", taskHandler.Create())
	tasks.Patch("/", taskHandler.Update())
	tasks.Delete("/", taskHandler.Delete())

	app.Listen(":8080")
}
