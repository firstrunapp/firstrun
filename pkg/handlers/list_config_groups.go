package handlers

import (
	"net/http"

	"github.com/firstrunapp/firstrun/pkg/config"
	configtypes "github.com/firstrunapp/firstrun/pkg/config/types"
	"github.com/firstrunapp/firstrun/pkg/logger"
)

type ListConfigGroupsResponse struct {
	AppName string               `json:"appName"`
	Groups  []*configtypes.Group `json:"groups"`
	Error   string               `json:"error,omitempty"`
}

func ListConfigGroups(w http.ResponseWriter, r *http.Request) {
	resp := ListConfigGroupsResponse{
		AppName: "Application Config",
	}

	groups, err := config.Groups()
	if err != nil {
		logger.Error(err)
		resp.Error = err.Error()
		JSON(w, http.StatusInternalServerError, resp)
		return
	}

	resp.Groups = groups

	JSON(w, http.StatusOK, resp)
}
