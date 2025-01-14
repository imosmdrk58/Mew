package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/melihaltin/manga-backend/config"
	"github.com/melihaltin/manga-backend/initializers"
	"github.com/rs/cors"

	"github.com/melihaltin/manga-backend/internal/db"
)

// func corsMiddleware(next http.Handler) http.Handler {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		// Set CORS headers
// 		w.Header().Set("Access-Control-Allow-Origin", "*") // Or your frontend URL
// 		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
// 		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

// 		// Handle preflight requests
// 		if r.Method == "OPTIONS" {
// 			w.WriteHeader(http.StatusOK)
// 			return
// 		}

// 		// Call the next handler
// 		next.ServeHTTP(w, r)
// 	})
// }

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
	initializers.InitializeAuthorComponents(database, router)
	initializers.InitializeChapterComponents(database, router)
	initializers.InitializePageComponents(database, router)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // Tüm origin'lere izin ver
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	handler := c.Handler(router)

	// Start server
	log.Println("Starting server on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
