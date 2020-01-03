package message

import (
	"encoding/json"
)

// Message Define a custom struct to hold Message data.
type Message struct {
	Id      string `json:"id"`
	Message string `json:"message"`
	Author  string `json:"author"`
	Likes   int    `json:"likes"`
}

// Messages is an array of Message
type Messages []Message

func (msg Message) MarshalBinary() ([]byte, error) {
	return json.Marshal(msg)
	// return []byte(fmt.Sprintf("%v-%v-%v", msg.Author, msg.Message, msg.Likes)), nil
}
