package apiserver

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/firstrunapp/firstrun/pkg/handlers"
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

	/**********************************************************************
	* Static routes
	**********************************************************************/

	srv := &http.Server{
		Handler: r,
		Addr:    ":3000",
	}

	fmt.Printf("Starting firstrun-api on port %d...\n", 3000)

	log.Fatal(srv.ListenAndServe())
}
