package handlers

import (
	"manga-api/internal/models"
	"manga-api/internal/repository"

	"manga-api/pkg/response"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type MangaHandler struct {
	repo *repository.MangaRepository
}

func NewMangaHandler(db *gorm.DB) *MangaHandler {
	return &MangaHandler{
		repo: repository.NewMangaRepository(db),
	}
}

func SetupRoutes(api *gin.RouterGroup, db *gorm.DB) {
	handler := NewMangaHandler(db)

	api.POST("/manga", handler.Create)
	api.GET("/manga", handler.List)
}

func (h *MangaHandler) Create(c *gin.Context) {
	var manga models.Manga

	if err := c.ShouldBindJSON(&manga); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.repo.Create(&manga); err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, "created", manga)
}

func (h *MangaHandler) List(c *gin.Context) {
	mangas, err := h.repo.FindAll()
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "collection", gin.H{
		"data":  mangas,
		"total": len(mangas),
	})
}
