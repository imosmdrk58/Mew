package chapter

import (
	"database/sql"
)

type ChapterRepository interface {
	GetAllChapters(mangaID int) ([]Chapter, error)
	GetChapterByID(id int) (*Chapter, error)
	CreateChapter(chapter *Chapter) error
}

type chapterRepository struct {
	db *sql.DB
}

func NewChapterRepository(db *sql.DB) ChapterRepository {
	return &chapterRepository{db: db}
}

func (r *chapterRepository) GetAllChapters(mangaID int) ([]Chapter, error) {
	rows, err := r.db.Query("SELECT chapter_id, title, chapter_number, release_date, manga_id FROM chapter WHERE manga_id = $1", mangaID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var chapterList []Chapter
	for rows.Next() {
		var chapter Chapter
		if err := rows.Scan(&chapter.ID, &chapter.Title, &chapter.ChapterNumber, &chapter.ReleaseDate, &chapter.MangaID); err != nil {
			return nil, err
		}
		chapterList = append(chapterList, chapter)
	}

	return chapterList, nil
}

func (r *chapterRepository) GetChapterByID(id int) (*Chapter, error) {

	row := r.db.QueryRow("SELECT chapter_id, title, chapter_number, release_date, manga_id FROM chapter WHERE chapter_id = $1", id)

	var chapter Chapter
	if err := row.Scan(&chapter.ID, &chapter.Title, &chapter.ChapterNumber, &chapter.ReleaseDate, &chapter.MangaID); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &chapter, nil
}

func (r *chapterRepository) CreateChapter(chapter *Chapter) error {
	_, err := r.db.Exec("INSERT INTO chapter (title, chapter_number, release_date, manga_id) VALUES ($1, $2, $3, $4)",
		chapter.Title, chapter.ChapterNumber, chapter.ReleaseDate, chapter.MangaID)
	return err
}
