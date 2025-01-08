package repository

import (
	"manga-api/internal/models"

	"gorm.io/gorm"
)

type MangaRepository struct {
	db *gorm.DB
}

func NewMangaRepository(db *gorm.DB) *MangaRepository {
	return &MangaRepository{db: db}
}

func (r *MangaRepository) Create(manga *models.Manga) error {
	return r.db.Create(manga).Error
}

func (r *MangaRepository) FindAll() ([]models.Manga, error) {
	var mangas []models.Manga
	err := r.db.Find(&mangas).Error
	return mangas, err
}
