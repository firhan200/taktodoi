package data

import (
	"errors"

	"gorm.io/gorm"
)

type TaskDB interface {
	Create(value interface{}) (tx *gorm.DB)
	Find(dest interface{}, conds ...interface{}) (tx *gorm.DB)
	First(dest interface{}, conds ...interface{}) (tx *gorm.DB)
	Save(value interface{}) (tx *gorm.DB)
	Delete(value interface{}, conds ...interface{}) (tx *gorm.DB)
}

type TaskData struct {
	db TaskDB
}

func NewTask(db TaskDB) *TaskData {
	return &TaskData{
		db: db,
	}
}

func (t *TaskData) Insert(userId int, name string, description string) (createdId int, err error) {
	task := &Task{
		UserId:      userId,
		Name:        name,
		Description: description,
	}

	res := t.db.Create(task)

	if res.Error != nil {
		return createdId, res.Error
	}

	if res.RowsAffected == 0 {
		return createdId, errors.New("failed to insert user")
	}

	createdId = int(task.Model.ID)

	return createdId, nil
}
