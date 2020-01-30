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
