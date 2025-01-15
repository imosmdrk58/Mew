package initializers

import (
	"database/sql"

	"github.com/gorilla/mux"
	"github.com/melihaltin/manga-backend/internal/domain/logs"
)

func InitializeLogsComponent(database *sql.DB, router *mux.Router) {
	// Initialize repositories
	logRepo := logs.NewLogRepository(database)

	// Initialize services
	logService := logs.NewLogService(logRepo)

	// Initialize handlers
	logHandler := logs.NewLogHandler(logService)

	// Register routes
	logHandler.RegisterRoutes(router)
}
