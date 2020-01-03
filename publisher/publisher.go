package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/go-redis/redis/v7"
	"github.com/gorilla/handlers"
)

var client *redis.Client

func main() {
	client = redis.NewClient(&redis.Options{
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

	router := NewRouter()

	cors := handlers.CORS(
		handlers.AllowedHeaders([]string{"content-type"}),
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowCredentials(),
	)

	log.Fatal(http.ListenAndServe(":8080", cors(router)))
}
