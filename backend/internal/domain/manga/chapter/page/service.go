package page

type PageService interface {
	GetPagesByChapterID(chapterID int) ([]Page, error)
	CreatePage(page *Page) error
	UpdatePage(page *Page) error
}

type pageService struct {
	repo PageRepository
}

func NewPageService(repo PageRepository) PageService {
	return &pageService{repo: repo}
}

func (s *pageService) GetPagesByChapterID(chapterID int) ([]Page, error) {
	return s.repo.GetPagesByChapterID(chapterID)
}

func (s *pageService) CreatePage(page *Page) error {
	return s.repo.CreatePage(page)
}

func (s *pageService) UpdatePage(page *Page) error {
	return s.repo.UpdatePage(page)
}
