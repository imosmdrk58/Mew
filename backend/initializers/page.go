package initializers

import (
	"database/sql"

	"github.com/gorilla/mux"
	"github.com/melihaltin/manga-backend/internal/domain/manga/chapter/page"
)

func InitializePageComponents(database *sql.DB, router *mux.Router) {
	// Initialize repositories
	pageRepo := page.NewPageRepository(database)

	// Initialize services
	pageService := page.NewPageService(pageRepo)

	// Initialize handlers
	pageHandler := page.NewPageHandler(pageService)

	// Register routes
	pageHandler.RegisterRoutes(router)
}
