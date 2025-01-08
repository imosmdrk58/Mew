package models

type Manga struct {
	ID          string `json:"id" gorm:"primaryKey"`
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
	CreatedAt   string `json:"created_at"`
}
