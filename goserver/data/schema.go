package data

import "gorm.io/gorm"

type User struct {
	gorm.Model
	FullName string
	Email    string
	Password string
	Tasks    []Task
}

type Task struct {
	gorm.Model
	Name        string
	Description string
	UserId      int
	User        User
}
