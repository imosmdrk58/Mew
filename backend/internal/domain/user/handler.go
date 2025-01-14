package user

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type UserHandler struct {
	service *UserService
}

func NewUserHandler(service *UserService) *UserHandler {
	return &UserHandler{service: service}
}

func (h *UserHandler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/users/create-user", h.CreateUser).Methods("POST")
	router.HandleFunc("/users/login", h.LoginUser).Methods("POST")
	router.HandleFunc("/users/{username}", h.GetUserByUsername).Methods("GET")
	router.HandleFunc("/users/{username}/favorites", h.GetUserFavorites).Methods("GET")
	router.HandleFunc("/users/{username}/favorites/manga/{mangaID}", h.IsMangaFavorited).Methods("GET")
	router.HandleFunc("/users/{username}/favorites/add", h.AddMangaToFavorites).Methods("POST")
	router.HandleFunc("/users/{username}/favorites", h.RemoveMangaFromFavorites).Methods("DELETE")
}

func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Printf("Error decoding user: %v", err)
		return
	}

	if err := h.service.CreateUser(&user); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("Error creating user: %v", err)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
	log.Printf("User created successfully: %v", user)
}

func (h *UserHandler) LoginUser(w http.ResponseWriter, r *http.Request) {
	var credentials LoginCredentials
	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Printf("Error decoding login credentials: %v", err)
		return
	}

	log.Printf("Login attempt with Username: %s, Password: %s", credentials.Username, credentials.Password)

	user, err := h.service.LoginUser(credentials.Username, credentials.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		log.Printf("Error logging in user: %v", err)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
	log.Printf("User logged in successfully: %v", user)
}

func (h *UserHandler) GetUserByUsername(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username := vars["username"]

	user, err := h.service.GetUserByUsername(username)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

func (h *UserHandler) GetUserFavorites(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username := vars["username"]

	log.Printf("Adding manga to favorites for user getUserFav: %s", username)
	user, err := h.service.GetUserByUsername(username)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	favorites, err := h.service.GetUserFavorites(user.UserID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(favorites)
}

func (h *UserHandler) AddMangaToFavorites(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username := vars["username"]
	log.Printf("Adding manga to favorites for user: %s", username)

	user, err := h.service.GetUserByUsername(username)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		log.Printf("User not found: %v", err)
		return
	}

	// Request body'yi struct olarak tanımla
	var request struct {
		MangaID int `json:"mangaId"`
	}

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Printf("Error decoding manga ID: %v", err)
		return
	}

	if err := h.service.AddMangaToFavorites(user.UserID, request.MangaID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("Error adding manga to favorites: %v", err)
		return
	}

	w.WriteHeader(http.StatusCreated)
	log.Printf("Manga added to favorites for user %s: %d", username, request.MangaID)
}

func (h *UserHandler) IsMangaFavorited(w http.ResponseWriter, r *http.Request) {

	log.Printf("Adding manga to favorites for user isFav")
	vars := mux.Vars(r)
	username := vars["username"]
	mangaIDStr := vars["mangaID"]
	mangaID, err := strconv.Atoi(mangaIDStr)

	if err != nil {
		http.Error(w, "Invalid manga ID", http.StatusBadRequest)
		log.Printf("Invalid manga ID: %v", err)
		return
	}

	user, err := h.service.GetUserByUsername(username)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		log.Printf("User not found: %v", err)
		return
	}

	isFavorited, err := h.service.IsMangaFavorited(user.UserID, mangaID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("Error checking if manga is favorited: %v", err)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(isFavorited)
	log.Printf("Manga favorited status for user %s and manga %d: %v", username, mangaID, isFavorited)
}

func (h *UserHandler) RemoveMangaFromFavorites(w http.ResponseWriter, r *http.Request) {
	log.Printf("Adding manga to favorites for user remove")
	vars := mux.Vars(r)
	username := vars["username"]
	mangaIDStr := vars["mangaID"]
	mangaID, err := strconv.Atoi(mangaIDStr)

	if err != nil {
		http.Error(w, "Invalid manga ID", http.StatusBadRequest)
		log.Printf("Invalid manga ID: %v", err)
		return
	}

	user, err := h.service.GetUserByUsername(username)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		log.Printf("User not found: %v", err)
		return
	}

	if err := h.service.RemoveMangaFromFavorites(user.UserID, mangaID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("Error removing manga from favorites: %v", err)
		return
	}

	w.WriteHeader(http.StatusOK)
	log.Printf("Manga removed from favorites for user %s: %d", username, mangaID)
}
