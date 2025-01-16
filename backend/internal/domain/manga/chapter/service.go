package chapter

type ChapterService interface {
	GetAllChapters(id int) ([]Chapter, error)
	GetChapterByID(id int) (*Chapter, error)
	GetChapterByMangaIDandChapterNumber(mangaId int, chapterNumber int) (*Chapter, error)
	CreateChapter(chapter *Chapter) (int, error)
	UpdateChapter(chapter *Chapter) error
	DeleteChapter(chapter_id int) error
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

func (s *chapterService) GetChapterByMangaIDandChapterNumber(mangaId int, chapterNumber int) (*Chapter, error) {
	return s.repo.GetChapterByMangaIDandChapterNumber(mangaId, chapterNumber)
}

func (s *chapterService) CreateChapter(chapter *Chapter) (int, error) {
	return s.repo.CreateChapter(chapter)
}

func (s *chapterService) UpdateChapter(chapter *Chapter) error {
	return s.repo.UpdateChapter(chapter)
}

func (s *chapterService) DeleteChapter(chapter_id int) error {
	return s.repo.DeleteChapter(chapter_id)
}
