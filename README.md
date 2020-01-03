# IHAQ-Web

[Check here](./cmd/web/README.md)

# IHAQ-Queue

In progress work

## Start Redis locally :

`docker run --rm --name redis -p 6379:6379 -d redis`

## Start Publisher / API :

`go run ./cmd/publisher/*.go`

## Start Woker :

`go run ./cmd/worker/worker.go`

## Debug / Curl command

```bash
# Post a message :
curl -d '{"message":"TVVMB","author":"Alex","likes":10}' localhost:8080/message
# Get messages :
curl -H "Content-Type: application/json" localhost:8080/messages | jq
```
