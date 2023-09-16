package middlewares

import (
	"net/http"
	"strings"

	"github.com/firhan200/taktodoi/goserver/utils"
	"github.com/gofiber/fiber/v2"
)

type AuthMiddleware struct{}

func NewAuthMiddleware() *AuthMiddleware {
	return &AuthMiddleware{}
}

func (a *AuthMiddleware) Verify() fiber.Handler {
	return func(c *fiber.Ctx) error {
		headers := c.GetReqHeaders()
		auth := headers["Authorization"]

		if !strings.Contains(auth, "Bearer") {
			return c.SendStatus(http.StatusUnauthorized)
		}

		//split
		a := strings.Split(auth, " ")
		token := a[1]

		//verify
		_, err := utils.Verify(token)
		if err != nil {
			return c.SendStatus(http.StatusUnauthorized)
		}

		return c.Next()
	}
}
