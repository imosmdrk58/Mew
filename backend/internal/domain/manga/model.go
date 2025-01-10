package manga

import "time"

type Manga struct {
	ID            int       `json:"id"`
	Title         string    `json:"title"`
	Description   string    `json:"description"`
	Status        string    `json:"status"`
	CoverImage    string    `json:"cover_image"`
	PublishedDate time.Time `json:"published_date" db:"published_date"`
	LastUpdated   time.Time `json:"last_updated" db:"last_updated"`
}
