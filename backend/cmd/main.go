package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/melihaltin/manga-backend/config"
	"github.com/melihaltin/manga-backend/initializers"
	"github.com/melihaltin/manga-backend/internal/db"
	"github.com/rs/cors"
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

	// Initialize components
	initializers.InitializeMangaComponents(database, router)
	initializers.InitializeUserComponents(database, router)
	initializers.InitializeAuthorComponents(database, router)
	initializers.InitializeChapterComponents(database, router)
	initializers.InitializePageComponents(database, router)
	initializers.InitializeLogsComponent(database, router)

	// Configure CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // Tüm origin'lere izin ver
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	// Wrap the router with the CORS handler
	handler := c.Handler(router)

	router.Use(LoggingMiddleware)

	// Start server
	log.Println("Starting server on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", handler))
}

func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println("Gelen istek:", r.URL.Path)
		next.ServeHTTP(w, r)
	})
}
