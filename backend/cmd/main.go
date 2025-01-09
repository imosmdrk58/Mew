package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/melihaltin/manga-backend/config"
	"github.com/melihaltin/manga-backend/internal/db"
	"github.com/melihaltin/manga-backend/internal/handlers"
	"github.com/melihaltin/manga-backend/internal/repositories"
	"github.com/melihaltin/manga-backend/internal/services"
)

func main() {
	// Load configuration
	cfg := config.LoadConfig()

	// Connect to database
	database, err := db.Connect(cfg)
	if err != nil {
		log.Fatalf("Database connection error: %v", err)
	}
	defer database.Close()

	// Initialize repositories
	mangaRepo := repositories.NewMangaRepository(database)

	// Initialize services
	mangaService := services.NewMangaService(mangaRepo)

	// Initialize handlers
	mangaHandler := handlers.NewMangaHandler(mangaService)

	// Initialize router
	router := mux.NewRouter()

	// Register routes
	mangaHandler.RegisterRoutes(router)

	// Start server
	log.Println("Starting server on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", router))
}
