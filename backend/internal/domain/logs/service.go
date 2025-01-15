// filepath: /Users/melihaltin/Documents/GitHub/MangaReaderWebsite/backend/internal/domain/logs/service.go
package logs

type LogService struct {
	repo *LogRepository
}

func NewLogService(repo *LogRepository) *LogService {
	return &LogService{repo: repo}
}

func (s *LogService) GetLogs(limit, offset int) ([]Log, error) {
	return s.repo.GetLogs(limit, offset)
}
