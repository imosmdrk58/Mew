package handlers

import (
	"encoding/json"
	"manga-api/internal/models"
	"manga-api/internal/repository"
	"net/http"
	"strconv"
)

type MangaHandler struct {
	Repo *repository.MangaRepository
}

func NewMangaHandler(repo *repository.MangaRepository) *MangaHandler {
	return &MangaHandler{Repo: repo}
}

// GetMangas fonksiyonu
func (h *MangaHandler) GetMangas(w http.ResponseWriter, r *http.Request) {
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	offset, _ := strconv.Atoi(r.URL.Query().Get("offset"))

	mangas, err := h.Repo.FindAll(limit, offset)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"result":   "ok",
		"response": "collection",
		"data":     mangas,
		"limit":    limit,
		"offset":   offset,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// CreateManga fonksiyonu
func (h *MangaHandler) CreateManga(w http.ResponseWriter, r *http.Request) {
	var manga models.Manga
	err := json.NewDecoder(r.Body).Decode(&manga)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = h.Repo.Create(&manga)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(manga)
}
