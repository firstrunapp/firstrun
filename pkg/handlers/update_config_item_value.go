package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/firstrunapp/firstrun/pkg/config"
	configtypes "github.com/firstrunapp/firstrun/pkg/config/types"
	"github.com/firstrunapp/firstrun/pkg/logger"
)

type UpdateConfigItemValuesRequest struct {
	Items []*configtypes.ItemValue `json:"items"`
}

type UpdateConfigItemValuesResponse struct {
	Error string `json:"error,omitempty"`
}

func UpdateConfigItemValues(w http.ResponseWriter, r *http.Request) {
	resp := UpdateConfigItemValuesResponse{}

	req := UpdateConfigItemValuesRequest{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logger.Error(err)
		resp.Error = err.Error()
		JSON(w, http.StatusInternalServerError, resp)
		return
	}

	for _, item := range req.Items {
		if err := config.SetItemValue(item); err != nil {
			logger.Error(err)
			resp.Error = err.Error()
			JSON(w, http.StatusInternalServerError, resp)
			return
		}
	}

	JSON(w, http.StatusCreated, resp)
}
