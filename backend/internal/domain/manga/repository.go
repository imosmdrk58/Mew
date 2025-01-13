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
	// Debug için sorgu parametrelerini yazdır
	log.Printf("Query params: %+v", params)

	query := `SELECT 
		m.manga_id, 
		m.title, 
		m.cover_image, 
		m.description, 
		m.status, 
		m.published_date, 
		m.rating, 
		COALESCE(a.author_id, 0) as author_id,
		COALESCE(a.name, '') as author_name,
		COALESCE(a.bio, '') as author_bio
	FROM manga m
	LEFT JOIN manga_authors ma ON m.manga_id = ma.manga_id
	LEFT JOIN authors a ON ma.author_id = a.author_id`

	// Sıralama parametrelerini ekle
	if params.SortBy != "" {
		query += fmt.Sprintf(" ORDER BY m.%s %s", params.SortBy, params.SortOrder)
	} else {
		query += " ORDER BY m.published_date DESC"
	}

	// Limit ekle
	if params.Limit > 0 {
		query += fmt.Sprintf(" LIMIT %d", params.Limit)
	}

	// Debug için son sorguyu yazdır
	log.Printf("Executing query: %s", query)

	rows, err := r.db.Query(query)
	if err != nil {
		log.Printf("Database query error: %v", err)
		return nil, err
	}
	defer rows.Close()

	var mangaList []Manga
	for rows.Next() {
		var manga Manga
		err := rows.Scan(
			&manga.ID,
			&manga.Title,
			&manga.CoverImage,
			&manga.Description,
			&manga.Status,
			&manga.PublishedDate,
			&manga.Rating,
			&manga.AuthorId,
			&manga.AuthorName,
			&manga.AuthorBio,
		)
		if err != nil {
			log.Printf("Row scan error: %v", err)
			return nil, err
		}
		// Debug için her bir manga kaydını yazdır
		log.Printf("Found manga: %+v", manga)
		mangaList = append(mangaList, manga)
	}

	log.Printf("Total manga found: %d", len(mangaList))
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
