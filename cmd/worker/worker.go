package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"

	. "github.com/french-tech-homies/ihaq/pkg/message"

	"github.com/go-redis/redis/v7"
)

var (
	client              *redis.Client
	redisServerName     string
	redisServerPort     string
	redisServerPassword string
	redisServerDB       int
)

func main() {
	flag.StringVar(&redisServerName, "redis-server-name", "localhost", "redis server name")
	flag.StringVar(&redisServerPort, "redis-server-port", "6379", "redis server port")
	flag.StringVar(&redisServerPassword, "redis-server-password", "", "redis server password")
	flag.IntVar(&redisServerDB, "redis-server-db", 0, "redis server db")

	flag.Parse()

	client = redis.NewClient(&redis.Options{
		Addr:     redisServerName + ":" + redisServerPort,
		Password: redisServerPassword, // no password set
		DB:       redisServerDB,       // use default DB
	})

	log.Printf("Starting worker app - Redis Addr {%s} - Password {%s} - DB {%d}", redisServerName+":"+redisServerPort, redisServerPassword, redisServerDB)

	pong, err := client.Ping().Result()
	if err != nil {
		fmt.Println(err)
		panic(err)
	}
	fmt.Println(pong)

	sub := client.Subscribe("message", "likes")

	ch := sub.Channel()
	for msg := range ch {
		if msg.Channel == "message" {
			fmt.Printf("Message received on channel %s\n", msg.Channel)
			var data Message
			json.Unmarshal([]byte(msg.Payload), &data)
			client.Set(data.Id, msg.Payload, 0)
			val, err := client.Get(data.Id).Result()
			if err != nil {
				panic(err)
			}
			fmt.Printf("Message stored : %s\n", val)
		} else if msg.Channel == "likes" {
			var payload LikePayload
			json.Unmarshal([]byte(msg.Payload), &payload)
			record, err := client.Get(payload.MessageID).Result()
			if err != nil {
				panic(err)
			}
			var message Message
			json.Unmarshal([]byte(record), &message)
			message.Likes = message.Likes + 1
			result := client.Set(message.Id, message, 0)

			if result.Err() != nil {
				panic(fmt.Errorf("Unable to add like to: %s", message.Id))
			}
			fmt.Printf("Added like to message : %s\n", message.Id)

		}

	}
}
