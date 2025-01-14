package author

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type AuthorHandler struct {
	repo AuthorRepository
}

func NewAuthorHandler(repo AuthorRepository) *AuthorHandler {
	return &AuthorHandler{repo: repo}
}

func (h *AuthorHandler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/authors", h.GetAllAuthors).Methods("GET")
	router.HandleFunc("/authors/{id}", h.GetAuthorByID).Methods("GET")
	router.HandleFunc("/authors/create-author", h.CreateAuthor).Methods("POST")
	router.HandleFunc("/authors/update", h.UpdateAuthor).Methods("PUT")
	router.HandleFunc("/authors/delete", h.DeleteAuthor).Methods("DELETE")
	router.HandleFunc("/authors/manga/{manga_id}", h.GetAuthorByMangaID).Methods("GET")
}

func (h *AuthorHandler) GetAllAuthors(w http.ResponseWriter, r *http.Request) {
	authors, err := h.repo.GetAllAuthors()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(authors)
}

func (h *AuthorHandler) GetAuthorByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid author ID", http.StatusBadRequest)
		return
	}

	author, err := h.repo.GetAuthorByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if author == nil {
		http.Error(w, "Author not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(author)
}

func (h *AuthorHandler) CreateAuthor(w http.ResponseWriter, r *http.Request) {
	var author Author
	if err := json.NewDecoder(r.Body).Decode(&author); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if err := h.repo.CreateAuthor(&author); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(author)
}

func (h *AuthorHandler) GetAuthorByMangaID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	mangaID, err := strconv.Atoi(vars["manga_id"])
	if err != nil {
		http.Error(w, "Invalid manga ID", http.StatusBadRequest)
		return
	}

	author, err := h.repo.GetAuthorByMangaID(mangaID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if author == nil {
		http.Error(w, "Author not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(author)
}

func (h *AuthorHandler) UpdateAuthor(w http.ResponseWriter, r *http.Request) {
	var author Author
	if err := json.NewDecoder(r.Body).Decode(&author); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if err := h.repo.UpdateAuthor(&author); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(author)
}

func (h *AuthorHandler) DeleteAuthor(w http.ResponseWriter, r *http.Request) {
	var author Author
	if err := json.NewDecoder(r.Body).Decode(&author); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if err := h.repo.DeleteAuthor(author.AuthorID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
