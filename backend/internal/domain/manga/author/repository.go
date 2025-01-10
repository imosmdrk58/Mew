package author

import (
	"database/sql"

	"github.com/melihaltin/manga-backend/internal/domain/manga"
)

type AuthorRepository interface {
	GetAllAuthors() ([]Author, error)
	GetAuthorByID(id int) (*Author, error)
	CreateAuthor(author *Author) error
	GetMangaByAuthorID(authorID int) ([]manga.Manga, error)
	GetAuthorByMangaID(mangaID int) (*Author, error)
}

type authorRepository struct {
	db *sql.DB
}

func NewAuthorRepository(db *sql.DB) AuthorRepository {
	return &authorRepository{db: db}
}

func (r *authorRepository) GetMangaByAuthorID(authorID int) ([]manga.Manga, error) {
	rows, err := r.db.Query(`
        SELECT m.manga_id, m.title, m.description, m.cover_image_url, m.status, m.published_date, m.last_updated
        FROM manga m
        JOIN manga_authors ma ON m.manga_id = ma.manga_id
        WHERE ma.author_id = $1`, authorID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var mangaList []manga.Manga
	for rows.Next() {
		var manga manga.Manga
		if err := rows.Scan(&manga.ID, &manga.Title, &manga.Description, &manga.CoverImage, &manga.Status, &manga.PublishedDate, &manga.LastUpdated); err != nil {
			return nil, err
		}
		mangaList = append(mangaList, manga)
	}

	return mangaList, nil
}

func (r *authorRepository) GetAllAuthors() ([]Author, error) {
	rows, err := r.db.Query("SELECT author_id, name, bio FROM authors")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var authorList []Author
	for rows.Next() {
		var author Author
		if err := rows.Scan(&author.AuthorID, &author.Name, &author.Bio); err != nil {
			return nil, err
		}
		authorList = append(authorList, author)
	}

	return authorList, nil
}

func (r *authorRepository) GetAuthorByID(id int) (*Author, error) {
	row := r.db.QueryRow("SELECT author_id, name, bio FROM authors WHERE author_id = $1", id)

	var author Author
	if err := row.Scan(&author.AuthorID, &author.Name, &author.Bio); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &author, nil
}

func (r *authorRepository) CreateAuthor(author *Author) error {
	_, err := r.db.Exec("INSERT INTO authors (name, bio) VALUES ($1, $2)",
		author.Name, author.Bio)
	return err
}

func (r *authorRepository) GetAuthorByMangaID(mangaID int) (*Author, error) {
	row := r.db.QueryRow(`
        SELECT a.author_id, a.name, a.bio
        FROM authors a
        JOIN manga_authors ma ON a.author_id = ma.author_id
        WHERE ma.manga_id = $1`, mangaID)

	var author Author
	if err := row.Scan(&author.AuthorID, &author.Name, &author.Bio); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &author, nil
}
