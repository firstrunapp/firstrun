package apiserver

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/firstrunapp/firstrun/pkg/handlers"
	"github.com/firstrunapp/firstrun/pkg/persistence"
	"github.com/gorilla/mux"
)

func Start() {
	log.Printf("firstrun api version %s\n", os.Getenv("VERSION"))

	r := mux.NewRouter()

	r.Methods("OPTIONS").HandlerFunc(handlers.CORS)

	/**********************************************************************
	* Unauthenticated routes
	**********************************************************************/

	r.HandleFunc("/healthz", handlers.Healthz)

	r.Path("/v1/groups").Methods("GET").HandlerFunc(handlers.ListConfigGroups)
	r.Path("/v1/group/{slug}").Methods("GET").HandlerFunc(handlers.ListConfigGroupItems)
	r.Path("/v1/items").Methods("PUT").HandlerFunc(handlers.UpdateConfigItemValues)

	r.Path("/v1/values").Methods("GET").HandlerFunc(handlers.ListConfigItemValues)

	/**********************************************************************
	* Static routes
	**********************************************************************/

	srv := &http.Server{
		Handler: r,
		Addr:    ":3000",
	}

	fmt.Printf("Starting firstrun-api on port %d...\n", 3000)

	// initialize the database
	if err := persistence.Init(); err != nil {
		panic(err)
	}

	log.Fatal(srv.ListenAndServe())
}
