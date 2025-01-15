// filepath: /Users/melihaltin/Documents/GitHub/MangaReaderWebsite/backend/internal/domain/logs/model.go
package logs

import "time"

type Log struct {
	LogID         int       `json:"log_id"`
	TableName     string    `json:"table_name"`
	OperationType string    `json:"operation_type"`
	RecordID      int       `json:"record_id"`
	OldData       string    `json:"old_data"`
	NewData       string    `json:"new_data"`
	UserID        int       `json:"user_id"`
	CreatedAt     time.Time `json:"created_at"`
}
