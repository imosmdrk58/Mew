package config

type Config struct {
	DatabaseURL string
}

func Load() *Config {
	return &Config{
		DatabaseURL: "host=localhost user=melihaltin password=Melih2003 dbname=MangaAPI port=5432 sslmode=disable",
	}
}
