// filepath: /Users/melihaltin/Documents/GitHub/MangaReaderWebsite/backend/internal/domain/logs/handler.go
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
	offsetStr := r.URL.Query().Get("offset")

	// Set default values if parameters are not provided
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 10 // Default limit
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil || offset < 0 {
		offset = 0 // Default offset
	}

	logs, err := h.service.GetLogs(limit, offset)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(logs)
}
