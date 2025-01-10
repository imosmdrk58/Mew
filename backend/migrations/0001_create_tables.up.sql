-- Enum type oluşturma
CREATE TYPE manga_status AS ENUM ('ongoing', 'completed', 'hiatus');

-- Users tablosu
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Authors tablosu
CREATE TABLE authors (
    author_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bio TEXT DEFAULT ''
);

-- Genres tablosu
CREATE TABLE genres (
    genre_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Manga tablosu
CREATE TABLE manga (
    manga_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    cover_image_url VARCHAR(255) DEFAULT '',
    status manga_status NOT NULL,
    published_date DATE DEFAULT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Manga_Authors ilişki tablosu (Many-to-Many)
CREATE TABLE manga_authors (
    manga_id INTEGER NOT NULL REFERENCES manga(manga_id) ON DELETE CASCADE,
    author_id INTEGER NOT NULL REFERENCES authors(author_id) ON DELETE CASCADE,
    PRIMARY KEY (manga_id, author_id)
);

-- Manga_Genres ilişki tablosu (Many-to-Many)
CREATE TABLE manga_genres (
    manga_id INTEGER NOT NULL REFERENCES manga(manga_id) ON DELETE CASCADE,
    genre_id INTEGER NOT NULL REFERENCES genres(genre_id) ON DELETE CASCADE,
    PRIMARY KEY (manga_id, genre_id)
);

-- Chapters tablosu
CREATE TABLE chapters (
    chapter_id SERIAL PRIMARY KEY,
    manga_id INTEGER NOT NULL REFERENCES manga(manga_id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL CHECK (chapter_number > 0),
    title VARCHAR(255) DEFAULT '',
    release_date DATE DEFAULT CURRENT_DATE,
    UNIQUE (manga_id, chapter_number)
);

-- Pages tablosu
CREATE TABLE pages (
    page_id SERIAL PRIMARY KEY,
    chapter_id INTEGER NOT NULL REFERENCES chapters(chapter_id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL CHECK (page_number > 0),
    image_url VARCHAR(255) NOT NULL,
    UNIQUE (chapter_id, page_number)
);

-- User_Reading_Progress tablosu
CREATE TABLE user_reading_progress (
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    manga_id INTEGER NOT NULL REFERENCES manga(manga_id) ON DELETE CASCADE,
    last_chapter_id INTEGER REFERENCES chapters(chapter_id) ON DELETE SET NULL,
    last_page_id INTEGER REFERENCES pages(page_id) ON DELETE SET NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, manga_id)
);

-- User_Favorites tablosu
CREATE TABLE user_favorites (
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    manga_id INTEGER NOT NULL REFERENCES manga(manga_id) ON DELETE CASCADE,
    favorited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, manga_id)
);

-- Ratings tablosu
CREATE TABLE ratings (
    rating_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    manga_id INTEGER NOT NULL REFERENCES manga(manga_id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review TEXT DEFAULT '',
    rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, manga_id)
);

-- Comments tablosu
CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    chapter_id INTEGER NOT NULL REFERENCES chapters(chapter_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
