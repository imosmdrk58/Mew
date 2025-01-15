package logs

import (
	"database/sql"
)

type LogRepository struct {
	db *sql.DB
}

func NewLogRepository(db *sql.DB) *LogRepository {
	return &LogRepository{db: db}
}

func (r *LogRepository) GetLogs(limit, offset int) ([]Log, error) {
	var logs []Log
	query := `
        SELECT log_id, table_name, operation_type, record_id, old_data, new_data, user_id, created_at 
        FROM logs 
        ORDER BY created_at DESC 
        LIMIT $1 OFFSET $2
    `
	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var log Log
		var oldData sql.NullString
		var newData sql.NullString
		var userID sql.NullInt64

		if err := rows.Scan(
			&log.LogID,
			&log.TableName,
			&log.OperationType,
			&log.RecordID,
			&oldData,
			&newData,
			&userID,
			&log.CreatedAt,
		); err != nil {
			return nil, err
		}

		// Convert `sql.NullString` values to `string`
		if oldData.Valid {
			log.OldData = oldData.String
		} else {
			log.OldData = "" // Assign empty string if NULL
		}

		if newData.Valid {
			log.NewData = newData.String
		} else {
			log.NewData = ""
		}

		// Convert `sql.NullInt64` value to `int`
		if userID.Valid {
			log.UserID = int(userID.Int64)
		} else {
			log.UserID = 0 // Assign default value 0 if NULL
		}

		logs = append(logs, log)
	}

	return logs, nil
}
