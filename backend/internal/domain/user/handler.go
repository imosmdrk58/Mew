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

	router.HandleFunc("/api/users", h.GetAllUsers).Methods("GET")
	router.HandleFunc("/users/{username}", h.DeleteUser).Methods("DELETE")
	router.HandleFunc("/users/{username}/role", h.ChangeUserRole).Methods("PATCH")

	router.HandleFunc("/favorites/add", h.AddMangaToFavorites).Methods("POST")
	router.HandleFunc("/favorites/remove", h.RemoveMangaFromFavorites).Methods("DELETE")
	router.HandleFunc("/favorites/user/{user_id}/manga/{manga_id}", h.IsMangaFavorited).Methods("GET")
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

func (h *UserHandler) IsMangaFavorited(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID, err := strconv.Atoi(vars["user_id"])
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}
	mangaID, err := strconv.Atoi(vars["manga_id"])
	if err != nil {
		http.Error(w, "Invalid manga ID", http.StatusBadRequest)
		return
	}

	isFavorited, err := h.service.IsMangaFavorited(userID, mangaID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]bool{"is_favorited": isFavorited})
}

func (h *UserHandler) AddMangaToFavorites(w http.ResponseWriter, r *http.Request) {

	var favourite Favourite
	if err := json.NewDecoder(r.Body).Decode(&favourite); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Printf("Error decoding adding favourite manga: %v", err)
		return
	}

	if err := h.service.AddMangaToFavorites(&favourite); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(favourite)
}

func (h *UserHandler) RemoveMangaFromFavorites(w http.ResponseWriter, r *http.Request) {
	var favourite Favourite

	if err := json.NewDecoder(r.Body).Decode(&favourite); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Printf("Error decoding removing favourite manga: %v", err)
		return
	}

	if err := h.service.RemoveMangaFromFavorites(&favourite); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(favourite)
}

func (h *UserHandler) GetAllUsers(w http.ResponseWriter, r *http.Request) {
	users, err := h.service.GetAllUsers()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(users)
}

func (h *UserHandler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username := vars["username"]

	if err := h.service.DeleteUser(username); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *UserHandler) ChangeUserRole(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username := vars["username"]

	var payload struct {
		IsAdmin bool `json:"is_admin"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.service.ChangeUserRole(username, payload.IsAdmin); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]bool{"is_admin": payload.IsAdmin})
}
