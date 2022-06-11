package config

import (
	"fmt"

	"github.com/firstrunapp/firstrun/pkg/config/types"
	"github.com/firstrunapp/firstrun/pkg/persistence"
)

func SetItemValue(item *types.ItemValue) error {
	// store the value in bolt
	db, err := persistence.Open()
	if err != nil {
		return fmt.Errorf("open db, %w", err)
	}
	defer db.Close()

	tx, err := db.Begin(true)
	if err != nil {
		return fmt.Errorf("begin tx, %w", err)
	}
	defer tx.Rollback()

	bucket, err := tx.CreateBucketIfNotExists([]byte(item.GroupHref))
	if err != nil {
		return fmt.Errorf("create bucket, %w", err)
	}

	if _, ok := item.Value.(string); ok {
		if err := bucket.Put([]byte(item.ItemName), []byte(item.Value.(string))); err != nil {
			return fmt.Errorf("put item, %w", err)
		}
	} else if _, ok := item.Value.(bool); ok {
		if err := bucket.Put([]byte(item.ItemName), []byte(fmt.Sprintf("%t", item.Value.(bool)))); err != nil {
			return fmt.Errorf("put item, %w", err)
		}
	} else if _, ok := item.Value.(int); ok {
		if err := bucket.Put([]byte(item.ItemName), []byte(fmt.Sprintf("%d", item.Value.(int)))); err != nil {
			return fmt.Errorf("put item, %w", err)
		}
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("commit tx, %w", err)
	}

	return nil
}
