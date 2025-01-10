package manga

type Manga struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"`
	CoverImage  string `json:"cover_image"`
}
