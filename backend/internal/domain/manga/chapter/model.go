package chapter

type Chapter struct {
	ID            int    `json:"id"`
	MangaID       int    `json:"manga_id"`
	ChapterNumber int    `json:"chapter_number"`
	Title         string `json:"title"`
	ReleaseDate   string `json:"release_date"`
	Pages         []Page `json:"pages"`
}

type Page struct {
	ID         int    `json:"id"`
	ChapterID  int    `json:"chapter_id"`
	PageNumber int    `json:"page_number"`
	ImageURL   string `json:"image_url"`
}
