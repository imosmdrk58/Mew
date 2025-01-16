package logs

import (
	"database/sql"
)

type LogResponse struct {
	Logs  []Log `json:"logs"`
	Total int   `json:"total"`
}

type LogRepository struct {
	db *sql.DB
}

func NewLogRepository(db *sql.DB) *LogRepository {
	return &LogRepository{db: db}
}

// Toplam kayıt sayısını getiren yeni method
func (r *LogRepository) GetTotalLogs() (int, error) {
	var total int
	query := "SELECT COUNT(*) FROM logs"
	err := r.db.QueryRow(query).Scan(&total)
	if err != nil {
		return 0, err
	}
	return total, nil
}

func (r *LogRepository) GetLogs(limit, offset int) (LogResponse, error) {
	var response LogResponse

	// Toplam kayıt sayısını al
	total, err := r.GetTotalLogs()
	if err != nil {
		return response, err
	}

	// Logları getir
	query := `
        SELECT log_id, table_name, operation_type, record_id, old_data, new_data, user_id, created_at 
        FROM logs 
        ORDER BY created_at DESC 
        LIMIT $1 OFFSET $2
    `

	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return response, err
	}
	defer rows.Close()

	var logs []Log
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
			return response, err
		}

		if oldData.Valid {
			log.OldData = oldData.String
		}
		if newData.Valid {
			log.NewData = newData.String
		}
		if userID.Valid {
			log.UserID = int(userID.Int64)
		}

		logs = append(logs, log)
	}

	response.Logs = logs
	response.Total = total
	return response, nil
}
