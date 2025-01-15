DROP VIEW IF EXISTS vw_manga_details;

DROP VIEW IF EXISTS vw_user_favorite_manga_details;

DROP TRIGGER IF EXISTS tr_chapter_update_manga ON chapters;

-- Trigger'ı sil
DROP TRIGGER IF EXISTS tr_author_delete_manga ON authors;

DROP FUNCTION IF EXISTS update_manga_last_updated_on_chapter();

-- Fonksiyonu sil
DROP FUNCTION IF EXISTS delete_manga_when_author_deleted();


-- get manga details fonksiyonunu sil
DROP FUNCTION IF EXISTS get_manga_details(INTEGER);

-- get chapter details fonksiyonunu sil
DROP FUNCTION IF EXISTS get_chapter_with_pagesid(INTEGER, INTEGER);

-- add manga with author fonksiyonunu sil
DROP FUNCTION IF EXISTS add_manga_with_author(VARCHAR(255), TEXT,manga_status,VARCHAR(255),INTEGER,DATE);

-- insert_page fonksiyonunu sil
DROP FUNCTION IF EXISTS insert_page(INTEGER, INTEGER,VARCHAR(255));

-- delete manga fonksiyonunu sil
DROP FUNCTION IF EXISTS delete_manga_by_id(INTEGER);

-- update manga fonksiyonunu sil
DROP FUNCTION IF EXISTS update_manga(INTEGER, VARCHAR(255), TEXT, manga_status, VARCHAR(255), INTEGER, DATE);

-- Comments tablosunu sil
DROP TABLE IF EXISTS comments CASCADE;

-- Ratings tablosunu sil
DROP TABLE IF EXISTS manga_ratings CASCADE;

-- Ratings tablosunu sil
DROP TABLE IF EXISTS ratings CASCADE;

-- User_Favorites tablosunu sil
DROP TABLE IF EXISTS user_favorites CASCADE;

-- User_Reading_Progress tablosunu sil
DROP TABLE IF EXISTS user_reading_progress CASCADE;

-- Pages tablosunu sil
DROP TABLE IF EXISTS pages CASCADE;

-- Chapters tablosunu sil
DROP TABLE IF EXISTS chapters CASCADE;

-- Manga_Genres ilişki tablosunu sil
DROP TABLE IF EXISTS manga_genres CASCADE;

-- Manga_Authors ilişki tablosunu sil
DROP TABLE IF EXISTS manga_authors CASCADE;

-- Manga tablosunu sil
DROP TABLE IF EXISTS manga CASCADE;

-- Genres tablosunu sil
DROP TABLE IF EXISTS genres CASCADE;

-- Authors tablosunu sil
DROP TABLE IF EXISTS authors CASCADE;

-- Users tablosunu sil
DROP TABLE IF EXISTS users CASCADE;

-- Enum type manga_status'u sil
DROP TYPE IF EXISTS manga_status CASCADE;