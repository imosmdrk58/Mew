package response

type Response struct {
	Result   string      `json:"result"`
	Response string      `json:"response"`
	Data     interface{} `json:"data"`
	Limit    int         `json:"limit"`
	Offset   int         `json:"offset"`
}
