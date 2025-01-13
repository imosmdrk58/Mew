package user

import (
	"database/sql"
	"fmt"

	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
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
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok {
			if pqErr.Code == "23505" { // unique_violation
				return fmt.Errorf("user with username %s or email %s already exists", user.Username, user.Email)
			}
		}
		return err
	}
	return nil
}

func (r *UserRepository) GetUserByUsername(username string) (*User, error) {

	// todo: Burada user'ın bilgileri yaptığı yorumlar gibi gibi bir çok şeyi çekmeliyiz yani starsları falan hepsi buradan çekilmeli
	user := &User{}
	query := `SELECT user_id, username, email, password_hash, is_admin, created_at FROM users WHERE username = $1`
	err := r.db.QueryRow(query, username).Scan(&user.UserID, &user.Username, &user.Email, &user.PasswordHash, &user.IsAdmin, &user.CreatedAt)
	return user, err
}

// login user

func (r *UserRepository) LoginUser(username, password string) (*User, error) {
	user := &User{}
	// First get the user by username only
	query := `SELECT user_id, username, email, password_hash, is_admin, created_at 
              FROM users WHERE username = $1`
	err := r.db.QueryRow(query, username).Scan(
		&user.UserID,
		&user.Username,
		&user.Email,
		&user.PasswordHash,
		&user.IsAdmin,
		&user.CreatedAt,
	)
	if err != nil {
		return nil, err
	}

	// Then verify the password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, fmt.Errorf("invalid password")
	}

	return user, nil
}
