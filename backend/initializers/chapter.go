package initializers

import (
	"database/sql"

	"github.com/gorilla/mux"
	"github.com/melihaltin/manga-backend/internal/domain/manga/chapter"
	"github.com/melihaltin/manga-backend/internal/domain/manga/chapter/page"
)

func InitializeChapterComponents(database *sql.DB, router *mux.Router) {
	// Initialize repositories
	chapterRepo := chapter.NewChapterRepository(database)
	pageRepo := page.NewPageRepository(database)

	// Initialize services
	chapterService := chapter.NewChapterService(chapterRepo)
	pageService := page.NewPageService(pageRepo)

	// Initialize handlers
	chapterHandler := chapter.NewChapterHandler(chapterService)
	pageHandler := page.NewPageHandler(pageService)

	// Register routes
	chapterHandler.RegisterRoutes(router)
	pageHandler.RegisterRoutes(router)
}
