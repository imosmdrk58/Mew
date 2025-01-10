package manga

type MangaService interface {
	GetAllManga() ([]Manga, error)
	GetMangaByID(id int) (*Manga, error)
    CreateManga(manga *Manga) error
}

type mangaService struct {
	repo MangaRepository
}

func NewMangaService(repo MangaRepository) MangaService {
	return &mangaService{repo: repo}
}

func (s *mangaService) GetAllManga() ([]Manga, error) {
	return s.repo.GetAllManga()
}

func (s *mangaService) GetMangaByID(id int) (*Manga, error) {
	return s.repo.GetMangaByID(id)
}

func (s *mangaService) CreateManga(manga *Manga) error {
	return s.repo.CreateManga(manga)
}
