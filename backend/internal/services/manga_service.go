package services

import (
	"github.com/melihaltin/manga-backend/internal/repositories"
)

type MangaService interface {
	GetAllManga() ([]repositories.Manga, error)
	GetMangaByID(id int) (*repositories.Manga, error)
}

type mangaService struct {
	repo repositories.MangaRepository
}

func NewMangaService(repo repositories.MangaRepository) MangaService {
	return &mangaService{repo: repo}
}

func (s *mangaService) GetAllManga() ([]repositories.Manga, error) {
	return s.repo.GetAllManga()
}

func (s *mangaService) GetMangaByID(id int) (*repositories.Manga, error) {
	return s.repo.GetMangaByID(id)
}
