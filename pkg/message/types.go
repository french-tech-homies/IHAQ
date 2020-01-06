package message

import (
	"encoding/json"
)

// Message Define a custom struct to hold Message data.
type Message struct {
	Id        string `json:"id"`
	Message   string `json:"message"`
	Author    string `json:"author"`
	Likes     int    `json:"likes"`
	Timestamp int64  `json:"timestamp"`
}

// Messages is an array of Message
type Messages []Message

func (msg Message) MarshalBinary() ([]byte, error) {
	return json.Marshal(msg)
}
