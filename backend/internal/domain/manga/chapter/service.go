package chapter

type ChapterService interface {
	GetAllChapters(id int) ([]Chapter, error)
	GetChapterByID(id int) (*Chapter, error)
	CreateChapter(chapter *Chapter) error
}

type chapterService struct {
	repo ChapterRepository
}

func NewChapterService(repo ChapterRepository) ChapterService {
	return &chapterService{repo: repo}
}

func (s *chapterService) GetAllChapters(id int) ([]Chapter, error) {
	return s.repo.GetAllChapters(id)
}

func (s *chapterService) GetChapterByID(id int) (*Chapter, error) {
	return s.repo.GetChapterByID(id)
}

func (s *chapterService) CreateChapter(chapter *Chapter) error {
	return s.repo.CreateChapter(chapter)
}
