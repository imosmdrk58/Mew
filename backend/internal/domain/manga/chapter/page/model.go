package page

type Page struct {
	ID         int    `json:"id"`
	ChapterID  int    `json:"chapter_id"`
	PageNumber int    `json:"page_number"`
	ImageURL   string `json:"image_url"`
}
