package data

import (
	"errors"

	"gorm.io/gorm"
)

type UserDB interface {
	Debug() (tx *gorm.DB)
	Create(value interface{}) (tx *gorm.DB)
	Find(dest interface{}, conds ...interface{}) (tx *gorm.DB)
	First(dest interface{}, conds ...interface{}) (tx *gorm.DB)
	Save(value interface{}) (tx *gorm.DB)
	Delete(value interface{}, conds ...interface{}) (tx *gorm.DB)
	Where(query interface{}, args ...interface{}) (tx *gorm.DB)
}

type UserData struct {
	db UserDB
}

func NewUser(db UserDB) *UserData {
	return &UserData{
		db: db,
	}
}

func (u *UserData) Insert(fullName string, email string, password string) (createdId int, err error) {
	user := &User{
		FullName: fullName,
		Email:    email,
		Password: password,
	}

	res := u.db.Create(user)

	if res.Error != nil {
		return createdId, res.Error
	}

	if res.RowsAffected == 0 {
		return createdId, errors.New("failed to insert user")
	}

	createdId = int(user.Model.ID)

	return createdId, nil
}

func (u *UserData) GetByEmail(email string) (User, error) {
	var user User

	res := u.db.Where(&User{
		Email: email,
	}).First(&user)

	if res.RowsAffected == 0 {
		err := errors.New("user not found")
		return user, err
	}

	return user, nil
}

func (u *UserData) GetByEmailAndPassword(email string, pass string) (User, error) {
	var user User

	res := u.db.Where(&User{
		Email:    email,
		Password: pass,
	}).First(&user)

	if res.RowsAffected == 0 {
		err := errors.New("user not found")
		return user, err
	}

	return user, nil
}
