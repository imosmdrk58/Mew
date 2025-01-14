package author

import "github.com/melihaltin/manga-backend/internal/domain/manga"

type AuthorService interface {
	GetAllAuthors() ([]Author, error)
	GetAuthorByID(id int) (*Author, error)
	CreateAuthor(author *Author) error
	GetMangaByAuthorID(authorID int) ([]manga.Manga, error)
	GetAuthorByMangaID(mangaID int) (*Author, error)
	UpdateAuthor(author *Author) error
	DeleteAuthor(authorID int) error
}

type authorService struct {
	repo AuthorRepository
}

func NewAuthorService(repo AuthorRepository) AuthorService {
	return &authorService{repo: repo}
}

func (s *authorService) GetAllAuthors() ([]Author, error) {
	return s.repo.GetAllAuthors()
}

func (s *authorService) GetAuthorByID(id int) (*Author, error) {
	return s.repo.GetAuthorByID(id)
}

func (s *authorService) CreateAuthor(author *Author) error {
	return s.repo.CreateAuthor(author)
}

func (s *authorService) GetMangaByAuthorID(authorID int) ([]manga.Manga, error) {
	return s.repo.GetMangaByAuthorID(authorID)
}

func (s *authorService) GetAuthorByMangaID(mangaID int) (*Author, error) {
	return s.repo.GetAuthorByMangaID(mangaID)
}

func (s *authorService) UpdateAuthor(author *Author) error {
	return s.repo.UpdateAuthor(author)
}

func (s *authorService) DeleteAuthor(authorID int) error {
	return s.repo.DeleteAuthor(authorID)
}
