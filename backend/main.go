package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Manga struct {
	ID          string `json:"id" gorm:"primaryKey"`
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
	CreatedAt   string `json:"created_at"`
}

var db *gorm.DB

// Veritabanı bağlantısını başlat
func initDatabase() {
	var err error
	dsn := "host=localhost user=melihaltin password=Melih2003 dbname=MangaAPI port=5432 sslmode=disable"
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database!")
	}

	// Tabloyu otomatik olarak oluştur
	db.AutoMigrate(&Manga{})
}

// Yeni manga ekleme
func addManga(c *gin.Context) {
	var manga Manga

	// Gelen JSON verisini Manga struct'ına bağla
	if err := c.ShouldBindJSON(&manga); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Manga'yı veritabanına kaydet
	if result := db.Create(&manga); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// Başarılı yanıt döndür
	c.JSON(http.StatusCreated, gin.H{
		"result":   "ok",
		"response": "created",
		"data":     manga,
	})
}

// Tüm mangaları listeleme
func listManga(c *gin.Context) {
	var mangas []Manga

	// Tüm mangaları veritabanından çek
	if result := db.Find(&mangas); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// Başarılı yanıt döndür
	c.JSON(http.StatusOK, gin.H{
		"result":   "ok",
		"response": "collection",
		"data":     mangas,
		"total":    len(mangas),
	})
}

func main() {
	// Veritabanı bağlantısını başlat
	initDatabase()

	// Gin router'ını oluştur
	r := gin.Default()

	// API endpoint'lerini tanımla
	api := r.Group("/api")
	{
		api.POST("/manga", addManga) // Manga ekleme
		api.GET("/manga", listManga) // Manga listeleme
	}

	// Sunucuyu başlat
	r.Run(":8080")
}
