package page

type PageService interface {
	GetPagesByChapterID(chapterID int) ([]Page, error)
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
