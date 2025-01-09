package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/melihaltin/manga-backend/config"
	"github.com/melihaltin/manga-backend/initializers"

	"github.com/melihaltin/manga-backend/internal/db"
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

	// Initialize router
	router := mux.NewRouter()

	initializers.InitializeMangaComponents(database, router)
	initializers.InitializeUserComponents(database, router)

	// Start server
	log.Println("Starting server on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", router))
}
