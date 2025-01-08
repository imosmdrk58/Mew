package repository

import (
	"database/sql"
	"encoding/json"
	"manga-api/internal/models"
)

type MangaRepository struct {
	DB *sql.DB
}

func NewMangaRepository(db *sql.DB) *MangaRepository {
	return &MangaRepository{DB: db}
}

// Create fonksiyonu
func (r *MangaRepository) Create(manga *models.Manga) error {
	// Manga'yı ekle
	attributesJSON, err := json.Marshal(manga.Attributes)
	if err != nil {
		return err
	}

	var mangaID int
	err = r.DB.QueryRow(
		`INSERT INTO mangas (type, attributes) VALUES ($1, $2) RETURNING id`,
		manga.Type, attributesJSON,
	).Scan(&mangaID)
	if err != nil {
		return err
	}

	// İlişkileri ekle
	for _, rel := range manga.Relationships {
		_, err = r.DB.Exec(
			`INSERT INTO relationships (manga_id, related_id, relationship_type_id, related_type)
			 VALUES ($1, $2, (SELECT id FROM relationship_types WHERE name = $3), $4)`,
			mangaID, rel.RelatedID, rel.Type, rel.RelatedType,
		)
		if err != nil {
			return err
		}
	}

	return nil
}

// FindAll fonksiyonu
func (r *MangaRepository) FindAll(limit, offset int) ([]models.Manga, error) {
	// Mangaları sorgula
	rows, err := r.DB.Query(
		`SELECT id, type, attributes FROM mangas LIMIT $1 OFFSET $2`,
		limit, offset,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var mangas []models.Manga
	for rows.Next() {
		var manga models.Manga
		var attributesJSON []byte

		err := rows.Scan(&manga.ID, &manga.Type, &attributesJSON)
		if err != nil {
			return nil, err
		}

		// Attributes'ı map'e dönüştür
		err = json.Unmarshal(attributesJSON, &manga.Attributes)
		if err != nil {
			return nil, err
		}

		// İlişkileri sorgula
		relRows, err := r.DB.Query(
			`SELECT r.related_id, rt.name, r.related_type
			 FROM relationships r
			 JOIN relationship_types rt ON r.relationship_type_id = rt.id
			 WHERE r.manga_id = $1`,
			manga.ID,
		)
		if err != nil {
			return nil, err
		}
		defer relRows.Close()

		for relRows.Next() {
			var rel models.Relationship
			err := relRows.Scan(&rel.RelatedID, &rel.Type, &rel.RelatedType)
			if err != nil {
				return nil, err
			}
			manga.Relationships = append(manga.Relationships, rel)
		}

		mangas = append(mangas, manga)
	}

	return mangas, nil
}
