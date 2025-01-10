package author

import (
	"time"
)

// Author represents the author of a manga.
type Author struct {
	AuthorID  int       `json:"author_id" db:"author_id"`
	Name      string    `json:"name" db:"name"`
	Bio       string    `json:"bio" db:"bio"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}
