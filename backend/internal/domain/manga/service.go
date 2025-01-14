package manga

type MangaService interface {
	GetMangaList(params MangaQueryParams) ([]Manga, error)
	GetMangaByID(id int) (*Manga, error)
	CreateManga(manga *Manga) error
	UpdateManga(manga *Manga) error
	DeleteManga(id int) error
	SearchManga(query string) ([]Manga, error)
	GetUserFavoriteMangas(id int) ([]Manga, error)
}

type mangaService struct {
	repo MangaRepository
}

func NewMangaService(repo MangaRepository) MangaService {
	return &mangaService{repo: repo}
}

func (s *mangaService) GetMangaByID(id int) (*Manga, error) {
	return s.repo.GetMangaByID(id)
}

func (s *mangaService) CreateManga(manga *Manga) error {
	return s.repo.CreateManga(manga)
}

func (s *mangaService) GetMangaList(params MangaQueryParams) ([]Manga, error) {
	return s.repo.GetMangaList(params)
}

func (s *mangaService) UpdateManga(manga *Manga) error {
	return s.repo.UpdateManga(manga)
}

func (s *mangaService) DeleteManga(id int) error {
	return s.repo.DeleteManga(id)
}

// search manga
func (s *mangaService) SearchManga(query string) ([]Manga, error) {
	return s.repo.SearchManga(query)
}

func (s *mangaService) GetUserFavoriteMangas(id int) ([]Manga, error) {
	return s.repo.GetUserFavoriteMangas(id)
}
