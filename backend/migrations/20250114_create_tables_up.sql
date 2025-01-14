-- Log tablosu oluşturma
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
BEGIN
    IF (TG_OP = 'DELETE') THEN
        old_data = row_to_json(OLD)::JSONB;
    ELSIF (TG_OP = 'UPDATE') THEN
        old_data = row_to_json(OLD)::JSONB;
        new_data = row_to_json(NEW)::JSONB;
    ELSIF (TG_OP = 'INSERT') THEN
        new_data = row_to_json(NEW)::JSONB;
    END IF;

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
        COALESCE(
            (CASE TG_OP
                WHEN 'DELETE' THEN (OLD).manga_id
                ELSE (NEW).manga_id
            END),
            (CASE TG_OP
                WHEN 'DELETE' THEN (OLD).chapter_id
                ELSE (NEW).chapter_id
            END)
        ),
        old_data,
        new_data,
        CURRENT_USER::INTEGER
    );

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