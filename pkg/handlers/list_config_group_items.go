package handlers

import (
	"net/http"

	"github.com/firstrunapp/firstrun/pkg/config"
	"github.com/firstrunapp/firstrun/pkg/logger"
	"github.com/gorilla/mux"
)

type Item struct {
	Name string `json:"name"`
}

type ListConfigGroupItemsResponse struct {
	GroupName string                 `json:"groupName"`
	Schema    string                 `json:"schema"`
	Values    map[string]interface{} `json:"values"`
	Error     string                 `json:"error,omitempty"`
}

func ListConfigGroupItems(w http.ResponseWriter, r *http.Request) {
	groupHref := mux.Vars(r)["slug"]

	itemSchema, err := config.GroupContent(groupHref)
	if err != nil {
		logger.Error(err)
		JSON(w, http.StatusInternalServerError, ListConfigGroupItemsResponse{
			Error: err.Error(),
		})
		return
	}

	itemValues, err := config.ValuesInGroup(groupHref)
	if err != nil {
		logger.Error(err)
		JSON(w, http.StatusInternalServerError, ListConfigGroupItemsResponse{
			Error: err.Error(),
		})
		return
	}

	resp := ListConfigGroupItemsResponse{
		GroupName: "firstrun",
		Schema:    string(itemSchema),
		Values:    itemValues,
	}

	JSON(w, http.StatusOK, resp)
}
