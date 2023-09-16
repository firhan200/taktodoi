package data

import (
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type DB struct {
	Conn *gorm.DB
}

func NewDB() *DB {
	// refer https://github.com/go-sql-driver/mysql#dsn-data-source-name for details
	dsn := "developer:123456@tcp(localhost:3306)/taktodoi_db?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	return &DB{
		Conn: db,
	}
}

func (d *DB) Migrate() {
	d.Conn.AutoMigrate(&User{}, &Task{})
}
