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
