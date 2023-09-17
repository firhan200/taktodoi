package data

import (
	"errors"

	"github.com/firhan200/taktodoi/goserver/cache"
	"gorm.io/gorm"
)

type TaskDB interface {
	Create(value interface{}) (tx *gorm.DB)
	Find(dest interface{}, conds ...interface{}) (tx *gorm.DB)
	First(dest interface{}, conds ...interface{}) (tx *gorm.DB)
	Save(value interface{}) (tx *gorm.DB)
	Delete(value interface{}, conds ...interface{}) (tx *gorm.DB)
	Where(query interface{}, args ...interface{}) (tx *gorm.DB)
}

type TaskData struct {
	db    TaskDB
	cache *cache.RedisCache
}

func NewTask(db TaskDB) *TaskData {
	client := cache.NewRedisCache()

	return &TaskData{
		db:    db,
		cache: client,
	}
}

func (t *TaskData) GetByUserId(userId int) ([]Task, error) {
	tasks := make([]Task, 0)

	// t.db.Where(&Task{
	// 	UserId: userId,
	// }).Find(&tasks)

	cachedTasks := t.cache.GetTasks(userId)
	for _, task := range cachedTasks {
		tasks = append(tasks, Task{
			Model: gorm.Model{
				ID: uint(task.Id),
			},
			Name:        task.Name,
			Description: task.Description,
		})
	}

	return tasks, nil
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
		return createdId, errors.New("failed to insert task")
	}

	createdId = int(task.Model.ID)

	// t.cache.SaveTasks(dto.CreatedTask{
	// 	Id:          1,
	// 	UserId:      userId,
	// 	Name:        name,
	// 	Description: description,
	// })

	return createdId, nil
}

func (t *TaskData) Update(id int, userId int, name string, description string) error {
	var task Task

	res := t.db.First(&task, id)
	if res.Error != nil {
		return res.Error
	}

	//check if authorize
	if task.UserId != userId {
		return errors.New("unauthorized actions")
	}

	task.Name = name
	task.Description = description

	savedRes := t.db.Save(task)

	if savedRes.Error != nil {
		return savedRes.Error
	}

	if savedRes.RowsAffected == 0 {
		return errors.New("failed to update task")
	}

	return nil
}

func (t *TaskData) Delete(id int, userId int) error {
	var task Task

	res := t.db.First(&task, id)
	if res.Error != nil {
		return res.Error
	}

	//check if authorize
	if task.UserId != userId {
		return errors.New("unauthorized actions")
	}

	deleteRes := t.db.Delete(&task)
	if deleteRes.Error != nil {
		return deleteRes.Error
	}

	if deleteRes.RowsAffected == 0 {
		return errors.New("failed to delete task")
	}

	return nil
}
