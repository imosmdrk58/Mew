package initializers

import (
	"database/sql"

	"github.com/gorilla/mux"
	"github.com/melihaltin/manga-backend/internal/domain/manga"
)

func InitializeMangaComponents(database *sql.DB, router *mux.Router) {
	// Initialize repositories
	mangaRepo := manga.NewMangaRepository(database)

	// Initialize services
	mangaService := manga.NewMangaService(mangaRepo)

	// Initialize handlers
	mangaHandler := manga.NewMangaHandler(mangaService)

	// Register routes
	mangaHandler.RegisterRoutes(router)
}
