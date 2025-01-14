-- Trigger'ları kaldır
DROP TRIGGER IF EXISTS tr_manga_log ON manga;
DROP TRIGGER IF EXISTS tr_chapters_log ON chapters;
DROP TRIGGER IF EXISTS tr_ratings_log ON ratings;

-- Trigger function'ı kaldır
DROP FUNCTION IF EXISTS log_changes();

-- Log tablosunu kaldır
DROP TABLE IF EXISTS logs;