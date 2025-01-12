package manga

import (
	"time"
)

type Manga struct {
	ID            int       `json:"id"`
	Title         string    `json:"title"`
	Description   string    `json:"description"`
	Status        string    `json:"status"`
	CoverImage    string    `json:"cover_image"`
	PublishedDate string    `json:"published_date" db:"published_date"`
	LastUpdated   time.Time `json:"last_updated" db:"last_updated"`
	AuthorId      int       `json:"author_id"`
	AuthorName    string    `json:"author_name"`
	AuthorBio     string    `json:"author_bio"`
}
