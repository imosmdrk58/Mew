package database

import (
	"database/sql"
	"fmt"
)

func CreateMangaTable(db *sql.DB) error {
	query := `
		CREATE TABLE IF NOT EXISTS mangas (
			id SERIAL PRIMARY KEY,
			type VARCHAR(50) NOT NULL,
			title VARCHAR(255) NOT NULL,
			description TEXT
		);
	`

	_, err := db.Exec(query)
	if err != nil {
		return fmt.Errorf("failed to create mangas table: %w", err)
	}

	fmt.Println("Mangas table created or already exists.")
	return nil
}
