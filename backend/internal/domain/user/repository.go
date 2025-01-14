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

func (r *UserRepository) AddMangaToFavorites(userID, mangaID int) error {
	query := `
		INSERT INTO user_favorites (user_id, manga_id)
		VALUES ($1, $2)
		ON CONFLICT (user_id, manga_id) DO NOTHING
	`

	result, err := r.db.Exec(query, userID, mangaID)
	if err != nil {
		fmt.Printf("Error adding manga to favorites: %v\n", err)
		return fmt.Errorf("failed to add manga to favorites: %v", err)
	}

	// Check if a row was actually inserted
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		fmt.Printf("Error checking rows affected: %v\n", err)
		return err
	}

	if rowsAffected == 0 {
		fmt.Printf("Manga is already in favorites for user_id: %d, manga_id: %d\n", userID, mangaID)
		return fmt.Errorf("manga is already in favorites")
	}

	fmt.Printf("Added manga to favorites for user_id: %d, manga_id: %d\n", userID, mangaID)
	return nil
}

func (r *UserRepository) RemoveMangaFromFavorites(userID, mangaID int) error {
	query := `
        DELETE FROM user_favorites 
        WHERE user_id = $1 AND manga_id = $2
    `

	result, err := r.db.Exec(query, userID, mangaID)
	if err != nil {
		return fmt.Errorf("failed to remove manga from favorites: %v", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("manga was not in favorites")
	}

	return nil
}

func (r *UserRepository) IsMangaFavorited(userID, mangaID int) (bool, error) {
	var exists bool
	query := `
		SELECT EXISTS(
			SELECT 1 FROM user_favorites 
			WHERE user_id = $1 AND manga_id = $2
		)
	`

	err := r.db.QueryRow(query, userID, mangaID).Scan(&exists)
	if err != nil {
		fmt.Printf("Error checking if manga is favorited: %v\n", err)
		return false, fmt.Errorf("failed to check favorite status: %v", err)
	}

	fmt.Printf("Checked favorite status for user_id: %d, manga_id: %d, exists: %t\n", userID, mangaID, exists)
	return exists, nil
}

func (r *UserRepository) GetUserFavorites(userID int) ([]int, error) {
	query := `
        SELECT manga_id 
        FROM user_favorites 
        WHERE user_id = $1 
        ORDER BY favorited_at DESC
    `

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user favorites: %v", err)
	}
	defer rows.Close()

	var mangaIDs []int
	for rows.Next() {
		var mangaID int
		if err := rows.Scan(&mangaID); err != nil {
			return nil, err
		}
		mangaIDs = append(mangaIDs, mangaID)
	}

	return mangaIDs, nil
}
