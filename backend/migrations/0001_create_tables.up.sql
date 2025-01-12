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

-- Get_manga_details fonksiyonunu oluştur
CREATE OR REPLACE FUNCTION get_manga_details(p_manga_id INT)
RETURNS TABLE (
    manga_id INTEGER,
    title VARCHAR(255),
    description TEXT,
    status manga_status,
    published_date DATE,
    cover_image_url VARCHAR(255),
    author_id INTEGER,
    author_name VARCHAR(255),
    author_bio TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.manga_id, 
        m.title, 
        m.description, 
        m.status, 
		m.published_date,
        m.cover_image_url, 
        a.author_id, 
        a.name AS author_name, 
        a.bio AS author_bio
    FROM 
        manga m
    JOIN 
        manga_authors ma ON m.manga_id = ma.manga_id
    JOIN 
        authors a ON ma.author_id = a.author_id
    WHERE 
        m.manga_id = p_manga_id;
END;
$$ LANGUAGE plpgsql;

-- Get_chapter_with_pages fonksiyonunu oluştur
CREATE OR REPLACE FUNCTION get_chapter_with_pagesid(
    p_manga_id INTEGER,
    p_chapter_number INTEGER
)
RETURNS TABLE (
    chapter_id INTEGER,
    manga_id INTEGER,
    chapter_number INTEGER,
    title VARCHAR(255),
    release_date DATE,
    page_id INTEGER,
    page_number INTEGER,
    image_url VARCHAR(255)
) AS $$
BEGIN
    RETURN QUERY
    SELECT c.chapter_id, c.manga_id, c.chapter_number, c.title, c.release_date, p.page_id, p.page_number, p.image_url
    FROM chapters c
    LEFT JOIN pages p ON c.chapter_id = p.chapter_id
    WHERE c.manga_id = p_manga_id AND c.chapter_number = p_chapter_number;
END;
$$ LANGUAGE plpgsql;

-- add manga with author fonksiyonunu oluştur
CREATE OR REPLACE FUNCTION add_manga_with_author(
    p_title VARCHAR(255),
    p_description TEXT,
    p_status manga_status,
    p_cover_image_url VARCHAR(255),
    p_author_id INTEGER,
    p_published_date DATE
)
RETURNS VOID AS $$
DECLARE
    v_manga_id INTEGER;
BEGIN
    -- manga tablosuna yeni bir kayıt ekle ve manga_id'yi al
    INSERT INTO manga (title, description, status, cover_image_url, published_date)
    VALUES (p_title, p_description, p_status, p_cover_image_url, p_published_date)
    RETURNING manga_id INTO v_manga_id;

    -- manga_authors tablosuna manga_id ve author_id'yi ekle
    INSERT INTO manga_authors (manga_id, author_id)
    VALUES (v_manga_id, p_author_id);
END;
$$ LANGUAGE plpgsql;

-- insert_page fonksiyonunu oluştur
CREATE OR REPLACE FUNCTION insert_page(
    p_chapter_id INTEGER,
    p_page_number INTEGER,
    p_image_url VARCHAR(255)
) RETURNS VOID AS $$
BEGIN
    -- Aynı chapter_id ve page_number kombinasyonunun zaten var olup olmadığını kontrol et
    IF EXISTS (SELECT 1 FROM pages WHERE chapter_id = p_chapter_id AND page_number = p_page_number) THEN
        RAISE EXCEPTION 'Bu chapter_id ve page_number kombinasyonu zaten mevcut.';
    END IF;

    -- Yeni sayfayı ekle
    INSERT INTO pages (chapter_id, page_number, image_url)
    VALUES (p_chapter_id, p_page_number, p_image_url);
END;
$$ LANGUAGE plpgsql;


-- view

-- vw_manga_details view oluştur
CREATE OR REPLACE VIEW vw_manga_details AS
SELECT 
    m.manga_id, 
    m.title, 
    m.description, 
    m.status, 
    m.cover_image_url, 
    m.published_date,  -- published_date sütunu eklendi
    a.author_id, 
    a.name AS author_name, 
    a.bio AS author_bio
FROM 
    manga m
JOIN 
    manga_authors ma ON m.manga_id = ma.manga_id
JOIN 
    authors a ON ma.author_id = a.author_id;