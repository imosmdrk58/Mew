-- Trigger'ları sil
DROP TRIGGER IF EXISTS tr_author_delete_manga ON authors;
DROP TRIGGER IF EXISTS tr_chapter_update_manga ON chapters;
DROP TRIGGER IF EXISTS tr_manga_log ON manga;
DROP TRIGGER IF EXISTS tr_chapters_log ON chapters;
DROP TRIGGER IF EXISTS tr_ratings_log ON ratings;
DROP TRIGGER IF EXISTS update_manga_rating_trigger ON ratings;

-- Fonksiyonları sil
DROP FUNCTION IF EXISTS delete_manga_when_author_deleted();
DROP FUNCTION IF EXISTS update_manga_last_updated_on_chapter();
DROP FUNCTION IF EXISTS log_changes();
DROP FUNCTION IF EXISTS update_manga_rating();
DROP FUNCTION IF EXISTS get_manga_details(INT);
DROP FUNCTION IF EXISTS get_chapter_with_pagesid(INT, INT);
DROP FUNCTION IF EXISTS add_manga_with_author(VARCHAR, TEXT, manga_status, VARCHAR, INT, DATE);
DROP FUNCTION IF EXISTS insert_page(INT, INT, VARCHAR);
DROP FUNCTION IF EXISTS update_manga(INT, VARCHAR, TEXT, manga_status, VARCHAR, INT, DATE);
DROP FUNCTION IF EXISTS delete_manga_by_id(INT);
DROP FUNCTION IF EXISTS update_page_image_url(INT,INT,VARCHAR);

-- Stored Procedure'ları sil
DROP PROCEDURE IF EXISTS DeleteUserByUsername(VARCHAR);
DROP PROCEDURE IF EXISTS UpdateUserAdminStatus(BOOLEAN, VARCHAR);
DROP PROCEDURE IF EXISTS AddToUserFavorites(INT, INT);

-- View'ları sil
DROP VIEW IF EXISTS vw_manga_details;
DROP VIEW IF EXISTS vw_user_favorite_manga_details;

-- Tabloları sil
DROP TABLE IF EXISTS logs;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS manga_ratings;
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS user_favorites;
DROP TABLE IF EXISTS user_reading_progress;
DROP TABLE IF EXISTS pages;
DROP TABLE IF EXISTS chapters;
DROP TABLE IF EXISTS manga_genres;
DROP TABLE IF EXISTS manga_authors;
DROP TABLE IF EXISTS manga;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS users;

-- Enum tipini sil
DROP TYPE IF EXISTS manga_status;