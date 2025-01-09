package user

import (
	"database/sql"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) CreateUser(user *User) error {
	query := `INSERT INTO users (username, email, password_hash, is_admin) VALUES ($1, $2, $3, $4) RETURNING user_id, created_at`
	err := r.db.QueryRow(query, user.Username, user.Email, user.PasswordHash, user.IsAdmin).Scan(&user.UserID, &user.CreatedAt)
	return err
}
