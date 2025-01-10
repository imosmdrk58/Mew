package initializers

import (
	"database/sql"

	"github.com/gorilla/mux"
	"github.com/melihaltin/manga-backend/internal/domain/manga/author"
)

func InitializeAuthorComponents(database *sql.DB, router *mux.Router) {
	// Initialize repositories
	authorRepo := author.NewAuthorRepository(database)

	// Initialize services
	authorService := author.NewAuthorService(authorRepo)

	// Initialize handlers
	authorHandler := author.NewAuthorHandler(authorService)

	// Register routes
	authorHandler.RegisterRoutes(router)
}
