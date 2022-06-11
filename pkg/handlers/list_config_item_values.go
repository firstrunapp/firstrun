package handlers

import (
	"net/http"

	"github.com/firstrunapp/firstrun/pkg/config"
	"github.com/firstrunapp/firstrun/pkg/logger"
)

type ListConfigItemValuesReeponse struct {
	Values map[string]interface{} `json:"values"`
	Error  string                 `json:"error,omitempty"`
}

func ListConfigItemValues(w http.ResponseWriter, r *http.Request) {
	resp := ListConfigItemValuesReeponse{}

	values, err := config.Values()
	if err != nil {
		logger.Error(err)
		resp.Error = err.Error()
		JSON(w, http.StatusInternalServerError, resp)
		return
	}

	resp.Values = values

	JSON(w, http.StatusOK, resp)
}
