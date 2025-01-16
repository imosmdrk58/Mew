package chapter

import (
	"database/sql"
	"fmt"
	"log"
)

type ChapterRepository interface {
	GetAllChapters(mangaID int) ([]Chapter, error)
	GetChapterByID(id int) (*Chapter, error)
	GetChapterByMangaIDandChapterNumber(mangaId int, chapterNumber int) (*Chapter, error)
	CreateChapter(chapter *Chapter) (int, error)
	UpdateChapter(chapter *Chapter) error
	DeleteChapter(chapter_id int) error
}

type chapterRepository struct {
	db *sql.DB
}

func NewChapterRepository(db *sql.DB) ChapterRepository {
	return &chapterRepository{db: db}
}

func (r *chapterRepository) GetAllChapters(mangaID int) ([]Chapter, error) {
	rows, err := r.db.Query("SELECT chapter_id, title, chapter_number, release_date, manga_id FROM chapters WHERE manga_id = $1", mangaID)
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

	row := r.db.QueryRow("SELECT chapter_id, title, chapter_number, release_date, manga_id FROM chapters WHERE chapter_id = $1", id)

	var chapter Chapter
	if err := row.Scan(&chapter.ID, &chapter.Title, &chapter.ChapterNumber, &chapter.ReleaseDate, &chapter.MangaID); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &chapter, nil
}

func (r *chapterRepository) GetChapterByMangaIDandChapterNumber(mangaId int, chapterNumber int) (*Chapter, error) {
	rows, err := r.db.Query("SELECT * FROM get_chapter_with_pagesid($1, $2)", mangaId, chapterNumber)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var chapter *Chapter
	var pages []Page
	for rows.Next() {
		var currentChapter Chapter
		var page Page
		if err := rows.Scan(&currentChapter.ID, &currentChapter.MangaID, &currentChapter.ChapterNumber, &currentChapter.Title, &currentChapter.ReleaseDate, &page.ID, &page.PageNumber, &page.ImageURL); err != nil {
			return nil, err
		}
		// First iteration or check for consistency
		if chapter == nil {
			chapter = &currentChapter
		} else {
			// Ensure chapter details are consistent across rows
			if chapter.ID != currentChapter.ID || chapter.MangaID != currentChapter.MangaID ||
				chapter.Title != currentChapter.Title || chapter.ChapterNumber != currentChapter.ChapterNumber {
				return nil, fmt.Errorf("inconsistent chapter details in query results")
			}
		}

		pages = append(pages, page)
	}
	if chapter == nil {
		return nil, fmt.Errorf("no chapter found for manga ID %d and chapter number %d", mangaId, chapterNumber)
	}

	chapter.Pages = pages
	return chapter, nil
}

func (r *chapterRepository) CreateChapter(chapter *Chapter) (int, error) {
	var chapterID int

	log.Print(chapter)
	err := r.db.QueryRow(
		"INSERT INTO chapters (title, chapter_number, release_date, manga_id) VALUES ($1, $2, $3, $4) RETURNING chapter_id",
		chapter.Title, chapter.ChapterNumber, chapter.ReleaseDate, chapter.MangaID,
	).Scan(&chapterID)

	if err != nil {
		return 0, err
	}

	return chapterID, nil
}

func (r *chapterRepository) UpdateChapter(chapter *Chapter) error {
	_, err := r.db.Exec(
		"UPDATE chapters SET title = $2,chapter_number = $3,release_date = $4 WHERE chapter_id = $1;",
		chapter.ID, chapter.Title, chapter.ChapterNumber, chapter.ReleaseDate,
	)
	return err
}

func (r *chapterRepository) DeleteChapter(chapter_id int) error {
	_, err := r.db.Exec("DELETE FROM chapters WHERE chapter_id = $1", chapter_id)
	return err
}
