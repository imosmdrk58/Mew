package database

import (
	"manga-api/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Initialize(dsn string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// Auto migrate models
	err = db.AutoMigrate(&models.Manga{})
	if err != nil {
		return nil, err
	}

	return db, nil
}
