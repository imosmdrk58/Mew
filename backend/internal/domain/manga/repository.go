package manga

import (
	"database/sql"
	"errors"
)

type MangaRepository interface {
	GetAllManga() ([]Manga, error)
	GetMangaByID(id int) (*Manga, error)
	CreateManga(manga *Manga) error
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
	row := r.db.QueryRow("SELECT * FROM get_manga_details($1);", id)

	var manga Manga
	if err := row.Scan(&manga.ID, &manga.Title, &manga.Description, &manga.Status, &manga.CoverImage, &manga.AuthorId, &manga.AuthorName, &manga.AuthorBio); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return &manga, nil
}

func (r *mangaRepository) CreateManga(manga *Manga) error {
	_, err := r.db.Exec("SELECT add_manga_with_author($1,$2,$3,$4,$5)",
		manga.Title, manga.Description, manga.Status, manga.CoverImage, manga.AuthorId)
	return err
}
