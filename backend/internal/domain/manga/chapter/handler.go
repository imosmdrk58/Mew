package chapter

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type ChapterHandler interface {
	RegisterRoutes(router *mux.Router)
	GetAllChapters(w http.ResponseWriter, r *http.Request)
	GetChapterByID(w http.ResponseWriter, r *http.Request)
	CreateChapter(w http.ResponseWriter, r *http.Request)
}

type chapterHandler struct {
	service ChapterService
}

func NewChapterHandler(service ChapterService) ChapterHandler {
	return &chapterHandler{service: service}
}

func (h *chapterHandler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/manga/{id}/chapters", h.GetAllChapters).Methods("GET")
	router.HandleFunc("/manga/chapters/{id}", h.GetChapterByID).Methods("GET")
	router.HandleFunc("/manga/{manga_id}/chapters/{chapter_number}", h.GetChapterByMangaIDandChapterNumber).Methods("GET")
	router.HandleFunc("/manga/{id}/chapters/create-chapter", h.CreateChapter).Methods("POST")
}

func (h *chapterHandler) GetAllChapters(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid manga ID", http.StatusBadRequest)
		return
	}

	chapters, err := h.service.GetAllChapters(id)
	if err != nil {
		http.Error(w, "Failed to fetch chapters", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(chapters)
}

func (h *chapterHandler) GetChapterByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid chapter ID", http.StatusBadRequest)
		return
	}

	chapter, err := h.service.GetChapterByID(id)
	if err != nil {
		http.Error(w, "Failed to fetch chapter details", http.StatusInternalServerError)
		return
	}

	if chapter == nil {
		http.Error(w, "Chapter not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(chapter)
}

func (h *chapterHandler) GetChapterByMangaIDandChapterNumber(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	mangaId, err := strconv.Atoi(vars["manga_id"])
	if err != nil {
		http.Error(w, "Invalid Manga Id", http.StatusBadRequest)
		return
	}

	chapterNumber, err := strconv.Atoi(vars["chapter_number"])
	if err != nil {
		http.Error(w, "Invalid Chapter Number", http.StatusBadRequest)
		return
	}

	chapter, err := h.service.GetChapterByMangaIDandChapterNumber(mangaId, chapterNumber)
	if err != nil {
		http.Error(w, "Failed to fetch chapter details", http.StatusInternalServerError)
		return
	}

	if chapter == nil {
		http.Error(w, "Chapter not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(chapter)
}

func (h *chapterHandler) CreateChapter(w http.ResponseWriter, r *http.Request) {
	var chapter Chapter
	if err := json.NewDecoder(r.Body).Decode(&chapter); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.service.CreateChapter(&chapter); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
