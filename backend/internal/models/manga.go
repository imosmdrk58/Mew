package models

type Manga struct {
	ID            string                 `json:"id"`
	Type          string                 `json:"type"`
	Attributes    map[string]interface{} `json:"attributes"`
	Relationships []Relationship         `json:"relationships"`
}

type Relationship struct {
	ID          string `json:"id"`
	Type        string `json:"type"`
	RelatedID   string `json:"related_id"`
	RelatedType string `json:"related_type"`
}
