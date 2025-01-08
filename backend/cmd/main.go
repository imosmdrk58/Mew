package main

import (
	"log"
	"manga-api/internal/config"
	"manga-api/internal/database"
	"manga-api/internal/handlers"
	"manga-api/internal/repository"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	cfg := config.LoadConfig()

	db, err := database.ConnectDB(cfg)
	if err != nil {
		log.Fatalf("Could not connect to database: %v", err)
	}
	defer db.Close()

	// Tabloyu oluştur
	err = database.CreateMangaTable(db)
	if err != nil {
		log.Fatalf("Could not create manga table: %v", err)
	}

	mangaRepo := repository.NewMangaRepository(db)
	mangaHandler := handlers.NewMangaHandler(mangaRepo)

	r := mux.NewRouter()
	r.HandleFunc("/manga", mangaHandler.GetMangas).Methods("GET")
	r.HandleFunc("/manga", mangaHandler.CreateManga).Methods("POST") // Yeni route

	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
