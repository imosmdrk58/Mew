package manga

import (
	"encoding/json"
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
	router.HandleFunc("/manga", h.GetAllManga).Methods("GET")
	router.HandleFunc("/manga/{id}", h.GetMangaByID).Methods("GET")
	router.HandleFunc("/manga/create-manga", h.CreateManga).Methods("POST")
}

func (h *MangaHandler) GetAllManga(w http.ResponseWriter, r *http.Request) {
	mangaList, err := h.service.GetAllManga()
	if err != nil {
		http.Error(w, "Failed to fetch manga list", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(mangaList)
}

func (h *MangaHandler) GetMangaByID(w http.ResponseWriter, r *http.Request) {
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
