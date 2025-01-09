package initializers

import (
	"database/sql"

	"github.com/gorilla/mux"
	"github.com/melihaltin/manga-backend/internal/domain/user"
)

func InitializeUserComponents(database *sql.DB, router *mux.Router) {
	// Initialize repositories
	userRepo := user.NewUserRepository(database)

	// Initialize services
	userService := user.NewUserService(userRepo)

	// Initialize handlers
	userHandler := user.NewUserHandler(userService)

	// Register routes
	userHandler.RegisterRoutes(router)
}
