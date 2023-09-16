package utils

import (
	"errors"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type JwtAuthClaims struct {
	Id int
	jwt.RegisteredClaims
}

type JwtAuth struct {
	claims *JwtAuthClaims
}

func NewJwtAuth(c *JwtAuthClaims) *JwtAuth {
	return &JwtAuth{
		claims: c,
	}
}

func (j *JwtAuth) Generate() (string, error) {
	key := os.Getenv("JWT_KEY")
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id": j.claims.Id,
	})

	s, err := t.SignedString([]byte(key))
	if err != nil {
		return "", err
	}

	return s, nil
}

func Verify(token string) (*JwtAuthClaims, error) {
	var claims *JwtAuthClaims

	t, err := jwt.ParseWithClaims(token, &JwtAuthClaims{}, func(t *jwt.Token) (interface{}, error) {
		key := os.Getenv("JWT_KEY")
		return []byte(key), nil
	})

	if err != nil {
		return claims, err
	}

	claims = t.Claims.(*JwtAuthClaims)

	return claims, nil
}

func ExtrackToken(c *fiber.Ctx) (*JwtAuthClaims, error) {
	var claims *JwtAuthClaims

	headers := c.GetReqHeaders()
	auth := headers["Authorization"]

	if !strings.Contains(auth, "Bearer") {
		return claims, errors.New("authorization undefined")
	}

	//split
	a := strings.Split(auth, " ")
	token := a[1]

	//verify
	cl, err := Verify(token)
	if err != nil {
		return claims, err
	}

	return cl, nil
}
