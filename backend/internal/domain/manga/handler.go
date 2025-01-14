package manga

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type MangaHandler struct {
	service MangaService
}

func NewMangaHandler(service MangaService) *MangaHandler {
	return &MangaHandler{service: service}
}

func (h *MangaHandler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/manga/search", h.SearchManga).Methods("GET")
	router.HandleFunc("/manga", h.GetMangaList).Methods("GET")
	router.HandleFunc("/manga/{id}", h.GetMangaByID).Methods("GET")
	router.HandleFunc("/manga/{id}", h.UpdateManga).Methods("PUT")
	router.HandleFunc("/manga/{id}", h.DeleteManga).Methods("DELETE")
	router.HandleFunc("/manga/create-manga", h.CreateManga).Methods("POST")

	router.HandleFunc("/favorites/user/{user_id}", h.GetUserFavoriteMangas).Methods("GET")
}

func (h *MangaHandler) GetMangaList(w http.ResponseWriter, r *http.Request) {
	// URL parametrelerini al
	query := r.URL.Query()

	params := MangaQueryParams{
		Limit:     parseIntParam(query.Get("limit"), 10),      // varsayılan limit 10
		Offset:    parseIntParam(query.Get("offset"), 0),      // varsayılan offset 0
		SortBy:    validateSortBy(query.Get("sort_by")),       // sort_by parametresini doğrula
		SortOrder: validateSortOrder(query.Get("sort_order")), // sort_order parametresini doğrula
	}

	mangaList, err := h.service.GetMangaList(params)
	if err != nil {
		http.Error(w, "Failed to fetch manga list", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(mangaList)
}

func (h *MangaHandler) GetMangaByID(w http.ResponseWriter, r *http.Request) {
	log.Printf("Şuan buradayım djkasndjk sanjkdsnajk ndjksan djksa")
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid manga ID", http.StatusBadRequest)
		return
	}

	manga, err := h.service.GetMangaByID(id)
	if err != nil {
		http.Error(w, "Failed to fetch manga details", http.StatusInternalServerError)
		return
	}

	if manga == nil {
		http.Error(w, "Manga not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(manga)
}

func (h *MangaHandler) CreateManga(w http.ResponseWriter, r *http.Request) {
	var manga Manga
	if err := json.NewDecoder(r.Body).Decode(&manga); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.service.CreateManga(&manga); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(manga)
}

func (h *MangaHandler) UpdateManga(w http.ResponseWriter, r *http.Request) {
	var manga Manga
	if err := json.NewDecoder(r.Body).Decode(&manga); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.service.UpdateManga(&manga); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(manga)
}

func (h *MangaHandler) DeleteManga(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid manga ID", http.StatusBadRequest)
		return
	}

	if err := h.service.DeleteManga(id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *MangaHandler) SearchManga(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	search := query.Get("search")

	log.Printf("Searching manga with jhere query: %s", search)

	mangaList, err := h.service.SearchManga(search)
	if err != nil {
		http.Error(w, "Failed to search manga", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(mangaList)
}
func (h *MangaHandler) GetUserFavoriteMangas(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["user_id"])
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	mangaList, err := h.service.GetUserFavoriteMangas(id)
	if err != nil {
		http.Error(w, "Failed to fetch favorite manga list", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(mangaList)
}

func parseIntParam(param string, defaultValue int) int {
	if param == "" {
		return defaultValue
	}
	value, err := strconv.Atoi(param)
	if err != nil {
		return defaultValue
	}
	return value
}

func validateSortBy(sortBy string) string {
	validFields := map[string]bool{
		"last_updated":   true,
		"published_date": true,
		"title":          true,
		"rating":         true,
	}

	if validFields[sortBy] {
		return sortBy
	}
	return "published_date" // varsayılan sıralama alanı
}

func validateSortOrder(sortOrder string) string {
	if sortOrder == "asc" {
		return "ASC"
	}
	return "DESC" // varsayılan sıralama yönü
}
