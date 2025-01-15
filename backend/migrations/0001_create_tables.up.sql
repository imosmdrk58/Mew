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
    cover_image VARCHAR(255) DEFAULT '',
    status manga_status NOT NULL,
    published_date DATE DEFAULT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rating DECIMAL(3,1) DEFAULT 0.0 CHECK (rating = 0.0 OR (rating >= 1.0 AND rating <= 5.0))
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


CREATE TABLE user_reading_progress (
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    manga_id INTEGER NOT NULL REFERENCES manga(manga_id) ON DELETE CASCADE,
    last_chapter_id INTEGER REFERENCES chapters(chapter_id) ON DELETE SET NULL,
    last_page_id INTEGER REFERENCES pages(page_id) ON DELETE SET NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, manga_id)
);


CREATE TABLE user_favorites (
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    manga_id INTEGER NOT NULL REFERENCES manga(manga_id) ON DELETE CASCADE,
    favorited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, manga_id)
);


CREATE TABLE ratings (
    rating_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    manga_id INTEGER NOT NULL REFERENCES manga(manga_id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review TEXT DEFAULT '',
    rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, manga_id)
);


CREATE TABLE IF NOT EXISTS manga_ratings (
    rating_id SERIAL PRIMARY KEY,
    manga_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manga_id) REFERENCES manga(manga_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    chapter_id INTEGER NOT NULL REFERENCES chapters(chapter_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE OR REPLACE FUNCTION get_manga_details(p_manga_id INT)
RETURNS TABLE (
    manga_id INTEGER,
    title VARCHAR(255),
    description TEXT,
    status manga_status,
    published_date DATE,
    cover_image VARCHAR(255),
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
        m.cover_image, 
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


CREATE OR REPLACE FUNCTION add_manga_with_author(
    p_title VARCHAR(255),
    p_description TEXT,
    p_status manga_status,
    p_cover_image VARCHAR(255),
    p_author_id INTEGER,
    p_published_date DATE
)
RETURNS VOID AS $$
DECLARE
    v_manga_id INTEGER;
BEGIN
  
    INSERT INTO manga (title, description, status, cover_image, published_date)
    VALUES (p_title, p_description, p_status, p_cover_image, p_published_date)
    RETURNING manga_id INTO v_manga_id;

    INSERT INTO manga_authors (manga_id, author_id)
    VALUES (v_manga_id, p_author_id);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION insert_page(
    p_chapter_id INTEGER,
    p_page_number INTEGER,
    p_image_url VARCHAR(255)
) RETURNS VOID AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM pages WHERE chapter_id = p_chapter_id AND page_number = p_page_number) THEN
        RAISE EXCEPTION 'Bu chapter_id ve page_number kombinasyonu zaten mevcut.';
    END IF;

    INSERT INTO pages (chapter_id, page_number, image_url)
    VALUES (p_chapter_id, p_page_number, p_image_url);
END;
$$ LANGUAGE plpgsql;

-- update fonksiyonu
CREATE OR REPLACE FUNCTION update_manga(
    p_manga_id INTEGER,
    p_title VARCHAR(255),
    p_description TEXT,
    p_status manga_status,
    p_cover_image VARCHAR(255),
    p_author_id INTEGER,
    p_published_date DATE
) RETURNS VOID AS $$
BEGIN
    
    UPDATE manga
    SET
        title = p_title,
        description = p_description,
        status = p_status,
        cover_image = p_cover_image,
        published_date = p_published_date,
        last_updated = CURRENT_TIMESTAMP
    WHERE
        manga_id = p_manga_id;

    
    IF EXISTS (SELECT 1 FROM manga_authors WHERE manga_id = p_manga_id AND author_id = p_author_id) THEN
        
        RETURN;
    ELSE
        -- 2 side pk oldugu icin
        DELETE FROM manga_authors WHERE manga_id = p_manga_id;
        
        INSERT INTO manga_authors (manga_id, author_id)
        VALUES (p_manga_id, p_author_id);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- manga sil fonksiyonu
CREATE OR REPLACE FUNCTION delete_manga_by_id(manga_id INT)
RETURNS VOID AS
$$
BEGIN
    -- manga_id'ye göre manga kaydını sil
    DELETE FROM manga WHERE manga.manga_id = delete_manga_by_id.manga_id;
    
    -- Eğer silinen kayıt yoksa kullanıcıya bilgi ver
    IF NOT FOUND THEN
        RAISE NOTICE 'Manga with id % not found.', manga_id;
    END IF;
END;
$$
LANGUAGE plpgsql;

-- Trigger fonksiyonu
CREATE OR REPLACE FUNCTION delete_manga_when_author_deleted()
RETURNS TRIGGER AS $$
DECLARE
    manga_ids INT[];
BEGIN
    -- Silinecek yazarın manga_id'lerini bir diziye al
    SELECT ARRAY(
        SELECT manga_id
        FROM manga_authors
        WHERE author_id = OLD.author_id
    ) INTO manga_ids;

    -- Eğer bu yazarın mangaları varsa, manga tablosundan sil
    IF array_length(manga_ids, 1) > 0 THEN
        DELETE FROM manga
        WHERE manga_id = ANY(manga_ids)
        AND NOT EXISTS (
            SELECT 1
            FROM manga_authors
            WHERE manga_id = ANY(manga_ids)
            AND author_id <> OLD.author_id
        );
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER tr_author_delete_manga
    BEFORE DELETE
    ON authors
    FOR EACH ROW
    EXECUTE FUNCTION delete_manga_when_author_deleted();


-- view

-- vw_manga_details view oluştur
DROP VIEW IF EXISTS vw_manga_details;
CREATE OR REPLACE VIEW vw_manga_details AS
SELECT 
    m.manga_id, 
    m.title, 
    m.description, 
    m.status, 
    m.cover_image, 
    m.published_date, 
    m.rating,
    COALESCE(a.author_id, 0) as author_id,
    COALESCE(a.name, '') as author_name,
    COALESCE(a.bio, '') as author_bio
FROM 
    manga m
LEFT JOIN 
    manga_authors ma ON m.manga_id = ma.manga_id
LEFT JOIN 
    authors a ON ma.author_id = a.author_id;


DROP VIEW IF EXISTS vw_user_favorite_manga_details;
CREATE OR REPLACE VIEW vw_user_favorite_manga_details AS
SELECT 
    uf.user_id, -- Kullanıcı ID'sini ekliyoruz
    m.manga_id, 
    m.title, 
    m.description, 
    m.status, 
    m.cover_image, 
    m.published_date, 
    m.rating,
    COALESCE(a.author_id, 0) as author_id,
    COALESCE(a.name, '') as author_name,
    COALESCE(a.bio, '') as author_bio,
    uf.favorited_at
FROM 
    manga m
LEFT JOIN 
    manga_authors ma ON m.manga_id = ma.manga_id
LEFT JOIN 
    authors a ON ma.author_id = a.author_id
JOIN 
    user_favorites uf ON m.manga_id = uf.manga_id
ORDER BY 
    uf.favorited_at DESC;



-- Trigger function
CREATE OR REPLACE FUNCTION update_manga_last_updated_on_chapter()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE manga
    SET last_updated = CURRENT_TIMESTAMP
    WHERE manga_id = NEW.manga_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER tr_chapter_update_manga
    AFTER INSERT
    ON chapters
    FOR EACH ROW
    EXECUTE FUNCTION update_manga_last_updated_on_chapter();


-- STORED PROCEDURES
CREATE OR REPLACE PROCEDURE DeleteUserByUsername(IN input_username VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM users WHERE username = input_username;
END;
$$;

CREATE OR REPLACE PROCEDURE UpdateUserAdminStatus(is_admin BOOLEAN, username VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE users
    SET is_admin = is_admin
    WHERE username = username;
END;
$$;

CREATE OR REPLACE PROCEDURE AddToUserFavorites(user_id_param INT, manga_id_param INT)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO user_favorites (user_id, manga_id)
    VALUES (user_id_param, manga_id_param)
    ON CONFLICT (user_id, manga_id) DO NOTHING;
END;
$$;












CREATE TABLE logs (
    log_id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    operation_type VARCHAR(20) NOT NULL,
    record_id INTEGER NOT NULL,
    old_data JSONB,
    new_data JSONB,
    user_id INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Log trigger function
CREATE OR REPLACE FUNCTION log_changes()
RETURNS TRIGGER AS $$
DECLARE
    old_data JSONB := NULL;
    new_data JSONB := NULL;
    record_id INTEGER := NULL;
    current_user_id INTEGER := NULL;
BEGIN
    -- Operation type-specific data assignment
    IF (TG_OP = 'DELETE') THEN
        old_data = row_to_json(OLD)::JSONB;
    ELSIF (TG_OP = 'UPDATE') THEN
        old_data = row_to_json(OLD)::JSONB;
        new_data = row_to_json(NEW)::JSONB;
    ELSIF (TG_OP = 'INSERT') THEN
        new_data = row_to_json(NEW)::JSONB;
    END IF;

    -- Determine record_id based on the table
    IF TG_TABLE_NAME = 'manga' THEN
        record_id = COALESCE(OLD.manga_id, NEW.manga_id);
    ELSIF TG_TABLE_NAME = 'chapters' THEN
        record_id = COALESCE(OLD.chapter_id, NEW.chapter_id);
    ELSIF TG_TABLE_NAME = 'ratings' THEN
        record_id = COALESCE(OLD.rating_id, NEW.rating_id);
    END IF;

    -- Get user_id based on CURRENT_USER (username)
    SELECT user_id INTO current_user_id
    FROM users
    WHERE username = CURRENT_USER;

    -- Insert log entry
    INSERT INTO logs (
        table_name,
        operation_type,
        record_id,
        old_data,
        new_data,
        user_id
    )
    VALUES (
        TG_TABLE_NAME,
        TG_OP,
        record_id,
        old_data,
        new_data,
        current_user_id
    );

    -- Return OLD or NEW record depending on operation type
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



-- Manga tablosu için trigger
CREATE TRIGGER tr_manga_log
AFTER INSERT OR UPDATE OR DELETE ON manga
FOR EACH ROW EXECUTE FUNCTION log_changes();

-- Chapters tablosu için trigger
CREATE TRIGGER tr_chapters_log
AFTER INSERT OR UPDATE OR DELETE ON chapters
FOR EACH ROW EXECUTE FUNCTION log_changes();

-- Ratings tablosu için trigger
CREATE TRIGGER tr_ratings_log
AFTER INSERT OR UPDATE OR DELETE ON ratings
FOR EACH ROW EXECUTE FUNCTION log_changes();