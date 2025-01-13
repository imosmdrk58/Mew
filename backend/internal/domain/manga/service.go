package manga

type MangaService interface {
	GetMangaList(params MangaQueryParams) ([]Manga, error)
	GetMangaByID(id int) (*Manga, error)
	CreateManga(manga *Manga) error
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
