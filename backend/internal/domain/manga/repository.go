package manga

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
)

type MangaRepository interface {
	GetMangaList(params MangaQueryParams) ([]Manga, error)
	GetMangaByID(id int) (*Manga, error)
	CreateManga(manga *Manga) error
}

type mangaRepository struct {
	db *sql.DB
}

func NewMangaRepository(db *sql.DB) MangaRepository {
	return &mangaRepository{db: db}
}

func (r *mangaRepository) GetMangaList(params MangaQueryParams) ([]Manga, error) {
	query := `SELECT 
        manga_id, title, cover_image, description, status, 
        published_date, author_id, author_name, 
        author_bio
        FROM vw_manga_details`

	// Sıralama parametrelerini ekle
	if params.SortBy != "" {
		log.Printf("Sorting by %s %s", params.SortBy, params.SortOrder)
		query += fmt.Sprintf(" ORDER BY %s %s", params.SortBy, params.SortOrder)
	} else {
		// Varsayılan sıralama
		query += " ORDER BY published_date DESC"
	}

	// Limit ve offset ekle
	if params.Limit > 0 {
		query += fmt.Sprintf(" LIMIT %d", params.Limit)
	}
	if params.Offset > 0 {
		query += fmt.Sprintf(" OFFSET %d", params.Offset)
	}

	rows, err := r.db.Query(query)
	if err != nil {
		log.Printf("Database query error: %v", err)
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
			&manga.Status,
			&manga.PublishedDate,
			&manga.AuthorId,
			&manga.AuthorName,
			&manga.AuthorBio,
		); err != nil {
			log.Printf("Row scan error: %v", err)
			return nil, err
		}
		mangaList = append(mangaList, manga)
	}

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
