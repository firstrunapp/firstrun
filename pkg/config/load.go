package config

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"sort"

	"github.com/firstrunapp/firstrun/pkg/config/types"
	"github.com/firstrunapp/firstrun/pkg/logger"
	"github.com/firstrunapp/firstrun/pkg/persistence"
	"github.com/gosimple/slug"
)

var (
	ConfigPath string

	groups []*types.Group // cache
)

func Groups() ([]*types.Group, error) {
	if groups == nil {
		if err := load(); err != nil {
			return nil, err
		}
	}

	return groups, nil
}

func Values() (map[string]interface{}, error) {
	values := map[string]interface{}{}

	groups, err := Groups()
	if err != nil {
		return nil, err
	}

	for _, group := range groups {
		groupValues, err := ValuesInGroup(group.Href)
		if err != nil {
			return nil, err
		}

		for key, value := range groupValues {
			values[key] = value
		}
	}

	return values, nil
}

func ValuesInGroup(groupHref string) (map[string]interface{}, error) {
	groupContent, err := GroupContent(groupHref)
	if err != nil {
		return nil, fmt.Errorf("group content, %w", err)
	}

	j := types.JSONSchemaValidator{}
	if err := json.Unmarshal(groupContent, &j); err != nil {
		return nil, fmt.Errorf("unmarshal group content, %w", err)
	}

	valueTypes := map[string]string{}

	for itemName, jj := range j.Properties {
		valueTypes[itemName] = jj.Type
	}

	db, err := persistence.Open()
	if err != nil {
		return nil, fmt.Errorf("open db, %w", err)
	}
	defer db.Close()

	tx, err := db.Begin(false)
	if err != nil {
		return nil, fmt.Errorf("begin tx, %w", err)
	}
	defer tx.Rollback()

	bucket := tx.Bucket([]byte(groupHref))

	if bucket == nil {
		return map[string]interface{}{}, nil
	}

	values := map[string]interface{}{}
	c := bucket.Cursor()
	for k, v := c.First(); k != nil; k, v = c.Next() {
		itemType, ok := valueTypes[string(k)]
		if !ok {
			// ? add it as a string type i guess
			values[string(k)] = string(v)
		} else {
			switch itemType {
			case "string":
				values[string(k)] = string(v)
			case "boolean":
				values[string(k)] = string(v) == "true"
			default:
				logger.Infof("unknown type %s", itemType)
			}
		}
	}

	return values, nil
}

func GroupContent(groupHref string) ([]byte, error) {
	if groups == nil {
		if err := load(); err != nil {
			return nil, err
		}
	}

	for _, group := range groups {
		if group.Href == groupHref {
			return ioutil.ReadFile(filepath.Join(ConfigPath, group.Filename))
		}
	}

	return nil, fmt.Errorf("group %s not found", groupHref)
}

func load() error {
	groups = []*types.Group{}

	idx := 0

	err := filepath.Walk(ConfigPath, func(filePath string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		b, err := ioutil.ReadFile(filePath)
		if err != nil {
			return nil
		}

		validator := types.JSONSchemaValidator{}

		if err := json.Unmarshal(b, &validator); err != nil {
			logger.Infof("ignoring file %s, %w", filePath, err)
		}

		if validator.Title == "" {
			logger.Infof("ignoring file %s, missing title", filePath)
		}

		if len(validator.Properties) == 0 {
			logger.Infof("ignoring file %s, missing properties", filePath)
		}

		group := types.Group{
			Index:    idx,
			Title:    validator.Title,
			Href:     slug.Make(validator.Title),
			Filename: filepath.Base(filePath),
		}

		groups = append(groups, &group)

		idx++

		return nil
	})
	if err != nil {
		return fmt.Errorf("walk config dir, %w", err)
	}

	deduplicated, err := deduplicateGroups(groups)
	if err != nil {
		return fmt.Errorf("deduplicate groups, %w", err)
	}

	sort.Sort(types.GroupList(deduplicated))
	if err != nil {
		return fmt.Errorf("sort groups, %w", err)
	}

	groups = deduplicated

	return nil
}

func deduplicateGroups(groups []*types.Group) ([]*types.Group, error) {
	deduplicated := []*types.Group{}

	for _, group := range groups {
		isDuplicate := false

		for _, deduplicatedGroup := range deduplicated {
			if group.Title == deduplicatedGroup.Title {
				isDuplicate = true
			}
		}

		if !isDuplicate {
			deduplicated = append(deduplicated, group)
		}
	}

	return deduplicated, nil
}
