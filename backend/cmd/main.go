package main

import (
	"log"
	"manga-api/database"
	"manga-api/internal/config"
	"manga-api/internal/handlers"

	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Initialize database
	db, err := database.Initialize(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("Database connection failed:", err)
	}

	// Initialize router
	r := gin.Default()

	// Setup routes
	api := r.Group("/api")
	handlers.SetupRoutes(api, db)

	// Start server
	r.Run(":8080")
}
