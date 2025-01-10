package author

// Author represents the author of a manga.
type Author struct {
	AuthorID int    `json:"author_id" db:"author_id"`
	Name     string `json:"name" db:"name"`
	Bio      string `json:"bio" db:"bio"`
}
