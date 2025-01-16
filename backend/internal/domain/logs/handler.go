// filepath: .../logs/handler.go
package logs

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type LogHandler struct {
	service *LogService
}

func NewLogHandler(service *LogService) *LogHandler {
	return &LogHandler{service: service}
}

func (h *LogHandler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/logs", h.GetLogs).Methods("GET")
}

func (h *LogHandler) GetLogs(w http.ResponseWriter, r *http.Request) {
	// Get pagination parameters from query string
	limitStr := r.URL.Query().Get("limit")
	pageStr := r.URL.Query().Get("page") // Değişiklik: offset yerine page kullanıyoruz

	// Set default values if parameters are not provided
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 10 // Default limit
	}

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1 // Default page
	}

	// Calculate offset from page
	offset := (page - 1) * limit

	response, err := h.service.GetLogs(limit, offset)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
