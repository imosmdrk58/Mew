-- Comments tablosunu sil
DROP TABLE IF EXISTS comments;

-- Ratings tablosunu sil
DROP TABLE IF EXISTS ratings;

-- User_Favorites tablosunu sil
DROP TABLE IF EXISTS user_favorites;

-- User_Reading_Progress tablosunu sil
DROP TABLE IF EXISTS user_reading_progress;

-- Pages tablosunu sil
DROP TABLE IF EXISTS pages;

-- Chapters tablosunu sil
DROP TABLE IF EXISTS chapters;

-- Manga_Genres ilişki tablosunu sil
DROP TABLE IF EXISTS manga_genres;

-- Manga_Authors ilişki tablosunu sil
DROP TABLE IF EXISTS manga_authors;

-- Manga tablosunu sil
DROP TABLE IF EXISTS manga;

-- Genres tablosunu sil
DROP TABLE IF EXISTS genres;

-- Authors tablosunu sil
DROP TABLE IF EXISTS authors;

-- Users tablosunu sil
DROP TABLE IF EXISTS users;

-- get manga details fonksiyonunu sil
DROP FUNCTION IF EXISTS get_manga_details(INTEGER);

-- get chapter details fonksiyonunu sil
DROP FUNCTION IF EXISTS get_chapter_with_pagesid(INTEGER, INTEGER);

-- add manga with author fonksiyonunu sil
DROP FUNCTION IF EXISTS add_manga_with_author(VARCHAR(255), TEXT,manga_status,VARCHAR(255),INTEGER);

-- Enum type manga_status'u sil
DROP TYPE IF EXISTS manga_status;