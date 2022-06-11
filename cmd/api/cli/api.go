package cli

import (
	"os"
	"path/filepath"

	"github.com/firstrunapp/firstrun/pkg/apiserver"
	"github.com/firstrunapp/firstrun/pkg/logger"
	"github.com/firstrunapp/firstrun/pkg/persistence"
	homedir "github.com/mitchellh/go-homedir"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

func APICmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "api",
		Short: "Starts the API server",
		Long:  `starts the firstrun rest api server`,
		PreRun: func(cmd *cobra.Command, args []string) {
			viper.BindPFlags(cmd.Flags())
		},
		RunE: func(cmd *cobra.Command, args []string) error {
			v := viper.GetViper()

			if v.GetString("log-level") == "debug" {
				logger.Info("setting log level to debug")
				logger.SetDebug()
			}

			dbPath, err := filepath.Abs(v.GetString("db-path"))
			if err != nil {
				return err
			}
			persistence.DBPath = dbPath

			apiserver.Start()
			return nil
		},
	}

	home, err := homedir.Dir()
	if err != nil {
		logger.Error(err)
		os.Exit(1)
	}

	cmd.Flags().String("log-level", "info", "set the log level")
	cmd.Flags().String("db-path", filepath.Join(home, "firstrun.db"), "set the path to the database")
	cmd.Flags().String("config-path", filepath.Join(home, "firstrun"), "set the path to a directory of config files")

	return cmd
}
