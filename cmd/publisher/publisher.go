package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"github.com/go-redis/redis/v7"
	"github.com/gorilla/handlers"
)

var (
	client              *redis.Client
	hub                 *Hub
	redisServerName     string
	redisServerPort     string
	redisServerPassword string
	redisServerDB       int
	apiPort             string
)

func main() {
	flag.StringVar(&redisServerName, "redis-server-name", "localhost", "redis server name")
	flag.StringVar(&redisServerPort, "redis-server-port", "6379", "redis server port")
	flag.StringVar(&redisServerPassword, "redis-server-password", "", "redis server password")
	flag.IntVar(&redisServerDB, "redis-server-db", 0, "redis server db")

	flag.StringVar(&apiPort, "api-server-port", "8080", "API server port")

	flag.Parse()

	hub = newHub()
	go hub.run()

	client = redis.NewClient(&redis.Options{
		Addr:     redisServerName + ":" + redisServerPort,
		Password: redisServerPassword, // no password set
		DB:       redisServerDB,       // use default DB
	})

	pong, err := client.Ping().Result()
	if err != nil {
		fmt.Println(err)
		panic(err)
	}
	fmt.Println(pong)

	router := NewRouter()

	cors := handlers.CORS(
		handlers.AllowedHeaders([]string{"content-type"}),
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowCredentials(),
	)

	log.Fatal(http.ListenAndServe(":"+apiPort, cors(router)))
}
