package handlers

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/firhan200/taktodoi/goserver/data"
	"github.com/firhan200/taktodoi/goserver/dto"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockUserData struct {
	mock.Mock
}

func (m *MockUserData) GetByEmail(email string) (data.User, error) {
	a := m.Called(email)
	return a.Get(0).(data.User), a.Error(1)
}
func (m *MockUserData) Insert(fullName string, email string, password string) (createdId int, err error) {
	a := m.Called(fullName, email, password)
	return a.Get(0).(int), a.Error(1)
}

func (m *MockUserData) GetByEmailAndPassword(email string, pass string) (data.User, error) {
	a := m.Called(email, pass)
	return a.Get(0).(data.User), a.Error(1)
}

func TestLogin_UnprocessableEntity_ShouldFaild(t *testing.T) {
	mobj := new(MockUserData)
	uh := NewUserHandler(mobj)

	app := fiber.New()

	app.Post("/login", uh.Login())

	req := httptest.NewRequest(http.MethodPost, "/login", nil)
	req.Header.Add("Content-Type", "application/json")

	res, err := app.Test(req, 10)
	if err != nil {
		log.Fatal(err)
	}
	assert.Equal(t, res.StatusCode, http.StatusBadRequest)
	assert.Nil(t, err)
	assert.NotNil(t, res)
}

func TestLogin_EmptyEmail_ShouldFail(t *testing.T) {
	mobj := new(MockUserData)
	uh := NewUserHandler(mobj)

	app := fiber.New()

	app.Post("/login", uh.Login())

	login := &dto.LoginDto{
		Email:    "",
		Password: "123456",
	}
	body, err := json.Marshal(login)
	if err != nil {
		log.Fatal(err)
	}

	req := httptest.NewRequest(http.MethodPost, "/login", bytes.NewReader(body))
	req.Header.Add("Content-Type", "application/json")

	res, err := app.Test(req, 10)
	if err != nil {
		log.Fatal(err)
	}
	assert.Equal(t, res.StatusCode, http.StatusBadRequest)
	assert.Nil(t, err)
	assert.NotNil(t, res)
}

func TestLogin_EmptyPassword_ShouldFail(t *testing.T) {
	mobj := new(MockUserData)
	uh := NewUserHandler(mobj)

	app := fiber.New()

	app.Post("/login", uh.Login())

	login := &dto.LoginDto{
		Email:    "test@email.com",
		Password: "",
	}
	body, err := json.Marshal(login)
	if err != nil {
		log.Fatal(err)
	}

	req := httptest.NewRequest(http.MethodPost, "/login", bytes.NewReader(body))
	req.Header.Add("Content-Type", "application/json")

	res, err := app.Test(req, 10)
	if err != nil {
		log.Fatal(err)
	}
	assert.Equal(t, res.StatusCode, http.StatusBadRequest)
	assert.Nil(t, err)
	assert.NotNil(t, res)
}

func TestLogin_EmptyEmailAndPassword_ShouldFail(t *testing.T) {
	mobj := new(MockUserData)
	uh := NewUserHandler(mobj)

	app := fiber.New()

	app.Post("/login", uh.Login())

	login := &dto.LoginDto{
		Email:    "",
		Password: "",
	}
	body, err := json.Marshal(login)
	if err != nil {
		log.Fatal(err)
	}

	req := httptest.NewRequest(http.MethodPost, "/login", bytes.NewReader(body))
	req.Header.Add("Content-Type", "application/json")

	res, err := app.Test(req, 10)
	if err != nil {
		log.Fatal(err)
	}
	assert.Equal(t, res.StatusCode, http.StatusBadRequest)
	assert.Nil(t, err)
	assert.NotNil(t, res)
}

func TestLogin_UserNotFound_ShouldFail(t *testing.T) {
	mobj := new(MockUserData)
	uh := NewUserHandler(mobj)

	mobj.On("GetByEmailAndPassword", mock.Anything, mock.Anything).Return(data.User{}, errors.New("user not found"))

	app := fiber.New()

	app.Post("/login", uh.Login())

	login := &dto.LoginDto{
		Email:    "test@email.com",
		Password: "password",
	}
	body, err := json.Marshal(login)
	if err != nil {
		log.Fatal(err)
	}

	req := httptest.NewRequest(http.MethodPost, "/login", bytes.NewReader(body))
	req.Header.Add("Content-Type", "application/json")

	res, err := app.Test(req, 10)
	if err != nil {
		log.Fatal(err)
	}
	assert.Equal(t, res.StatusCode, http.StatusBadRequest)
	assert.Nil(t, err)
	assert.NotNil(t, res)
}

func TestLogin_UserFound_ShouldSuccess(t *testing.T) {
	mobj := new(MockUserData)
	uh := NewUserHandler(mobj)

	mobj.On("GetByEmailAndPassword", mock.Anything, mock.Anything).Return(data.User{
		Email: "test@gmail.com",
	}, nil)

	app := fiber.New()

	app.Post("/login", uh.Login())

	login := &dto.LoginDto{
		Email:    "test@email.com",
		Password: "password",
	}
	body, err := json.Marshal(login)
	if err != nil {
		log.Fatal(err)
	}

	req := httptest.NewRequest(http.MethodPost, "/login", bytes.NewReader(body))
	req.Header.Add("Content-Type", "application/json")

	res, err := app.Test(req, 10)
	if err != nil {
		log.Fatal(err)
	}

	bodyRes, err := io.ReadAll(res.Body)
	if err != nil {
		log.Fatal(err)
	}

	assert.Equal(t, res.StatusCode, http.StatusOK)
	assert.Nil(t, err)
	assert.Contains(t, string(bodyRes), "token")
}
