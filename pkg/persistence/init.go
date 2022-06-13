package persistence

import (
	"fmt"

	"github.com/firstrunapp/firstrun/pkg/logger"
	bolt "go.etcd.io/bbolt"
	"go.uber.org/zap"
)

var (
	DBPath string
)

func Init() error {
	logger.Info("initializing database", zap.String("path", DBPath))

	db, err := bolt.Open(DBPath, 0600, nil)
	if err != nil {
		return fmt.Errorf("open db, %w", err)
	}
	defer db.Close()

	return nil
}

func Open() (*bolt.DB, error) {
	db, err := bolt.Open(DBPath, 0600, nil)
	if err != nil {
		return nil, fmt.Errorf("open db, %w", err)
	}

	return db, nil
}
