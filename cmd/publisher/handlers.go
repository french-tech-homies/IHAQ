package main

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	. "github.com/french-tech-homies/ihaq/pkg/message"
	uuid "github.com/satori/go.uuid"
)

func Index(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "IHAQ API!")
}

func postMessage(w http.ResponseWriter, r *http.Request) {
	var message Message
	body, err := ioutil.ReadAll(io.LimitReader(r.Body, 1048576))
	if err != nil {
		panic(err)
	}
	if err := r.Body.Close(); err != nil {
		panic(err)
	}
	if err := json.Unmarshal(body, &message); err != nil {
		w.Header().Set("Content-Type", "application/json; charset=UTF-8")
		w.WriteHeader(422) // unprocessable entity
		if err := json.NewEncoder(w).Encode(err); err != nil {
			panic(err)
		}
	}

	if message.Message == "" || message.Author == "" {
		fmt.Fprintln(w, "Message and Author cannot be empty! - Please verify your paylod")
		return
	}

	message.Id = uuid.NewV4().String()
	message.Timestamp = time.Now().Unix()

	if err != nil {
		log.Println("Error")
		panic(err)
	}
	result := client.Publish("message", message)
	if result.Err() != nil {
		panic(result.Err())
	}
	log.Printf("Msg Published : %v", message)

	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(message); err != nil {
		panic(err)
	}
}

func postLike(w http.ResponseWriter, r *http.Request) {
	var payload LikePayload
	body, err := ioutil.ReadAll(io.LimitReader(r.Body, 1048576))
	if err != nil {
		panic(err)
	}
	if err := r.Body.Close(); err != nil {
		panic(err)
	}
	if err := json.Unmarshal(body, &payload); err != nil {
		w.Header().Set("Content-Type", "application/json; charset=UTF-8")
		w.WriteHeader(422) // unprocessable entity
		if err := json.NewEncoder(w).Encode(err); err != nil {
			panic(err)
		}
	}
	log.Printf("Adding a like to message %+v", payload)
	result := client.Publish("likes", payload)
	if result.Err() != nil {
		panic(result.Err())
	}
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusCreated)
}

func getMessages(w http.ResponseWriter, r *http.Request) {
	keysResult, err := client.Keys("*").Result()
	if err != nil {
		fmt.Println("Value does not exists")
		return
	}
	log.Printf("Got Messages keys : %v", keysResult)

	var messages []Message
	for _, key := range keysResult {
		var message Message
		result, err := client.Get(key).Result()
		if err != nil {
			fmt.Printf("Error : %s", err.Error())
			return
		}
		err = json.Unmarshal([]byte(result), &message)
		if err != nil {
			fmt.Printf("Error : %s", err.Error())
			return
		}
		messages = append(messages, message)
	}
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(messages); err != nil {
		panic(err)
	}
}

func wsEndpoint(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	serveWs(hub, w, r)
}

// serveWs handles websocket requests from the peer.
func serveWs(hub *Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	client := &Client{hub: hub, conn: conn, send: make(chan []byte, 256)}
	client.hub.register <- client

	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	go client.writePump()
	go client.readPump()
}
