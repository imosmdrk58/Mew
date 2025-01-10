package initializers

import (
	"database/sql"

	"github.com/gorilla/mux"
	"github.com/melihaltin/manga-backend/internal/domain/manga/chapter"
)

func InitializeChapterComponents(database *sql.DB, router *mux.Router) {
	// Initialize repositories
	chapterRepo := chapter.NewChapterRepository(database)

	// Initialize services
	chapterService := chapter.NewChapterService(chapterRepo)

	// Initialize handlers
	chapterHandler := chapter.NewChapterHandler(chapterService)

	// Register routes
	chapterHandler.RegisterRoutes(router)
}
