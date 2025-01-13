package manga

import (
	"database/sql"
	"errors"
	"log"
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
	rows, err := r.db.Query("SELECT manga_id, title, cover_image, description FROM vw_manga_details")
	if err != nil {
		log.Printf("Database query error: %v", err) // Hata detayını logla
		return nil, err
	}
	defer rows.Close()

	var mangaList []Manga
	for rows.Next() {
		var manga Manga
		if err := rows.Scan(
			&manga.ID,
			&manga.Title,
			&manga.CoverImage,
			&manga.Description,
		); err != nil {
			log.Printf("Row scan error: %v", err) // Tarama hatalarını logla
			return nil, err
		}
		mangaList = append(mangaList, manga)
	}

	// log manga
	for _, manga := range mangaList {
		log.Printf("Manga: %v", manga)
	}

	// Eğer hiç sonuç yoksa bu durumu loglayabilirsiniz
	if len(mangaList) == 0 {
		log.Println("No manga found in the database.")
	}

	return mangaList, nil
}

func (r *mangaRepository) GetMangaByID(id int) (*Manga, error) {
	row := r.db.QueryRow("SELECT * FROM get_manga_details($1);", id)

	var manga Manga
	if err := row.Scan(&manga.ID, &manga.Title, &manga.Description, &manga.Status, &manga.PublishedDate, &manga.CoverImage, &manga.AuthorId, &manga.AuthorName, &manga.AuthorBio); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return &manga, nil
}

func (r *mangaRepository) CreateManga(manga *Manga) error {
	_, err := r.db.Exec("SELECT add_manga_with_author($1,$2,$3,$4,$5,$6)",
		manga.Title, manga.Description, manga.Status, manga.CoverImage, manga.AuthorId, manga.PublishedDate)
	return err
}
