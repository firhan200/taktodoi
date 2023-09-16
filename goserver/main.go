package main

import (
	"log"

	"github.com/firhan200/taktodoi/goserver/data"
	"github.com/firhan200/taktodoi/goserver/handlers"
	"github.com/firhan200/taktodoi/goserver/middlewares"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	db := data.NewDB()
	db.Migrate()
	taskData := data.NewTask(db.Conn)
	taskHandler := handlers.NewTaskHandler(taskData)
	userData := data.NewUser(db.Conn)
	userHandler := handlers.NewUserHandler(userData)
	authMiddleware := middlewares.NewAuthMiddleware()

	app := fiber.New()

	auth := app.Group("/auth")
	auth.Post("/register", userHandler.Register())
	auth.Post("/login", userHandler.Login())

	tasks := app.Group("/tasks", authMiddleware.Verify())
	tasks.Get("/", taskHandler.GetAll())
	tasks.Post("/", taskHandler.Create())
	tasks.Patch("/", taskHandler.Update())
	tasks.Delete("/", taskHandler.Delete())

	app.Listen(":8080")
}
