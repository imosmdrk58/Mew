package repositories

import (
	"database/sql"
	"errors"
)

type Manga struct {
	ID          int
	Title       string
	Description string
	Status      string
	CoverImage  string
}

type MangaRepository interface {
	GetAllManga() ([]Manga, error)
	GetMangaByID(id int) (*Manga, error)
}

type mangaRepository struct {
	db *sql.DB
}

func NewMangaRepository(db *sql.DB) MangaRepository {
	return &mangaRepository{db: db}
}

func (r *mangaRepository) GetAllManga() ([]Manga, error) {
	rows, err := r.db.Query("SELECT manga_id, title, description, status, cover_image_url FROM manga")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var mangaList []Manga
	for rows.Next() {
		var manga Manga
		if err := rows.Scan(&manga.ID, &manga.Title, &manga.Description, &manga.Status, &manga.CoverImage); err != nil {
			return nil, err
		}
		mangaList = append(mangaList, manga)
	}

	return mangaList, nil
}

func (r *mangaRepository) GetMangaByID(id int) (*Manga, error) {
	row := r.db.QueryRow("SELECT manga_id, title, description, status, cover_image_url FROM manga WHERE manga_id = $1", id)

	var manga Manga
	if err := row.Scan(&manga.ID, &manga.Title, &manga.Description, &manga.Status, &manga.CoverImage); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return &manga, nil
}
