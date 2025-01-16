package page

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type PageHandler interface {
	RegisterRoutes(router *mux.Router)
	GetPagesByChapterID(w http.ResponseWriter, r *http.Request)
	CreatePage(w http.ResponseWriter, r *http.Request)
}

type pageHandler struct {
	service PageService
}

func NewPageHandler(service PageService) PageHandler {
	return &pageHandler{service: service}
}

func (h *pageHandler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/chapters/{chapter_id}/pages", h.GetPagesByChapterID).Methods("GET")
	router.HandleFunc("/chapters/{chapter_id}/pages", h.CreatePage).Methods("POST")
	router.HandleFunc("/pages/update", h.UpdatePage).Methods("PUT")
}

func (h *pageHandler) GetPagesByChapterID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	chapterID, err := strconv.Atoi(vars["chapter_id"])
	if err != nil {
		http.Error(w, "Invalid chapter ID", http.StatusBadRequest)
		return
	}

	pages, err := h.service.GetPagesByChapterID(chapterID)
	if err != nil {
		http.Error(w, "Failed to fetch pages", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(pages)
}

func (h *pageHandler) CreatePage(w http.ResponseWriter, r *http.Request) {
	var page Page
	if err := json.NewDecoder(r.Body).Decode(&page); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.service.CreatePage(&page); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(page)
}

func (h *pageHandler) UpdatePage(w http.ResponseWriter, r *http.Request) {
	var page Page
	if err := json.NewDecoder(r.Body).Decode(&page); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.service.UpdatePage(&page); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(page)
}
