package user

import "time"

type User struct {
	UserID       int       `json:"user_id"`
	Username     string    `json:"username"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"password_hash"`
	CreatedAt    time.Time `json:"created_at"`
	IsAdmin      bool      `json:"is_admin"`
}

type LoginCredentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type Favourite struct {
	MangaID int `json:"manga_id"`
	UserID  int `json:"user_id"`
}
