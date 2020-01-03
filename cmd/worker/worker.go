package main

import (
	"encoding/json"
	"fmt"

	. "github.com/french-tech-homies/ihaq/pkg/message"

	"github.com/go-redis/redis/v7"
)

var client *redis.Client

func main() {
	client := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	pong, err := client.Ping().Result()
	if err != nil {
		fmt.Println(err)
		panic(err)
	}
	fmt.Println(pong)

	sub := client.Subscribe("message")

	ch := sub.Channel()
	for msg := range ch {
		fmt.Printf("Message received on channel %s\n", msg.Channel)
		var data Message
		json.Unmarshal([]byte(msg.Payload), &data)
		client.Set(data.Id, msg.Payload, 0)
		val, err := client.Get(data.Id).Result()
		if err != nil {
			panic(err)
		}
		fmt.Printf("Message stored : %s\n", val)
	}
}
