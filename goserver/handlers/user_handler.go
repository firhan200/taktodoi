package handlers

import (
	"net/http"

	"github.com/firhan200/taktodoi/goserver/data"
	"github.com/firhan200/taktodoi/goserver/utils"
	"github.com/gofiber/fiber/v2"
)

type UserHandler struct {
	userData *data.UserData
}

func NewUserHandler(ud *data.UserData) *UserHandler {
	return &UserHandler{
		userData: ud,
	}
}

func (uh *UserHandler) Register() fiber.Handler {
	type RegisterDto struct {
		FullName string `json:"full_name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	return func(c *fiber.Ctx) error {
		var registerDto RegisterDto
		if err := c.BodyParser(&registerDto); err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		//validate
		validateErrs := make([]string, 0)
		if registerDto.FullName == "" {
			validateErrs = append(validateErrs, "full name cannot be empty")
		}
		if registerDto.Email == "" {
			validateErrs = append(validateErrs, "email cannot be empty")
		}
		if registerDto.Password == "" {
			validateErrs = append(validateErrs, "password cannot be empty")
		}
		if len(validateErrs) > 0 {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"errors": validateErrs,
			})
		}

		//check if email already taken
		_, err := uh.userData.GetByEmail(registerDto.Email)
		if err == nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"errors": "email already taken",
			})
		}

		//encrypt password
		p := utils.NewPassword(registerDto.Password)
		hashedPassword := p.Encrypt()

		taskId, err := uh.userData.Insert(registerDto.FullName, registerDto.Email, hashedPassword)
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

func (uh *UserHandler) Login() fiber.Handler {
	type LoginDto struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	return func(c *fiber.Ctx) error {
		var loginDto LoginDto
		if err := c.BodyParser(&loginDto); err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		//validate
		validateErrs := make([]string, 0)
		if loginDto.Email == "" {
			validateErrs = append(validateErrs, "email cannot be empty")
		}
		if loginDto.Password == "" {
			validateErrs = append(validateErrs, "password cannot be empty")
		}
		if len(validateErrs) > 0 {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"errors": validateErrs,
			})
		}

		//encrypt password
		p := utils.NewPassword(loginDto.Password)
		hashedPassword := p.Encrypt()

		u, err := uh.userData.GetByEmailAndPassword(loginDto.Email, hashedPassword)
		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"errors": err.Error(),
			})
		}

		//generate jwt
		jwt := utils.NewJwtAuth(&utils.JwtAuthClaims{
			Id: int(u.ID),
		})
		token, err := jwt.Generate()
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"errors": err.Error(),
			})
		}

		return c.Status(http.StatusOK).JSON(fiber.Map{
			"token": token,
		})
	}
}
