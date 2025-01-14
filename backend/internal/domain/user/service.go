package user

type UserService struct {
	repo *UserRepository
}

func NewUserService(repo *UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) CreateUser(user *User) error {
	return s.repo.CreateUser(user)
}

func (s *UserService) LoginUser(username, password string) (*User, error) {
	return s.repo.LoginUser(username, password)
}

func (s *UserService) GetUserByUsername(username string) (*User, error) {
	return s.repo.GetUserByUsername(username)
}

func (s *UserService) AddMangaToFavorites(userID, mangaID int) error {
	return s.repo.AddMangaToFavorites(userID, mangaID)
}

func (s *UserService) RemoveMangaFromFavorites(userID, mangaID int) error {
	return s.repo.RemoveMangaFromFavorites(userID, mangaID)
}

func (s *UserService) IsMangaFavorited(userID, mangaID int) (bool, error) {
	return s.repo.IsMangaFavorited(userID, mangaID)
}

func (s *UserService) GetUserFavorites(userID int) ([]int, error) {
	return s.repo.GetUserFavorites(userID)
}

func (s *UserService) DeleteUser(username string) error {
	return s.repo.DeleteUser(username)
}

func (s *UserService) ChangeUserRole(username string, isAdmin bool) error {
	return s.repo.ChangeUserRole(username, isAdmin)
}

func (s *UserService) GetAllUsers() ([]User, error) {
	return s.repo.GetAllUsers()
}


