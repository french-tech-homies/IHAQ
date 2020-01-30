package main

import (
	"net/http"

	"github.com/gorilla/mux"

	logger "github.com/french-tech-homies/ihaq/pkg/log"
)

// Route Infos
type Route struct {
	Name        string
	Method      string
	Pattern     string
	HandlerFunc http.HandlerFunc
}

// Routes Array of Route
type Routes []Route

// NewRouter Creating New Mux Router
func NewRouter() *mux.Router {

	router := mux.NewRouter().StrictSlash(true)
	for _, route := range routes {
		var handler http.Handler

		handler = route.HandlerFunc
		handler = logger.Logger(handler, route.Name)

		router.
			Methods(route.Method).
			Path(route.Pattern).
			Name(route.Name).
			Handler(handler)
	}

	return router
}

var routes = Routes{
	Route{
		"Index",
		"GET",
		"/",
		Index,
	},
	Route{
		"getmessages",
		"GET",
		"/messages",
		getMessages,
	},
	Route{
		"postmessage",
		"POST",
		"/message",
		postMessage,
	},
	Route{
		"socket",
		"GET",
		"/ws",
		wsEndpoint,
	},
	Route{
		"postlike",
		"POST",
		"/like",
		postLike,
	},
}
