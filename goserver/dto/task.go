package dto

import "time"

type Task struct {
	Id          int       `json:"id"`
	UserId      int       `json:"user_id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
}
