package types

type Group struct {
	Title string `json:"title"`

	Filename string `json:"filename"`
	Href     string `json:"href"`
	Index    int    `json:"index"`
}

type GroupList []*Group

func (g GroupList) Len() int {
	return len(g)
}

func (g GroupList) Less(i, j int) bool {
	return g[i].Index < g[j].Index
}

func (g GroupList) Swap(i, j int) {
	g[i], g[j] = g[j], g[i]
}

type JSONSchemaValidator struct {
	Title      string                             `json:"title"`
	Properties map[string]JSONItemSchemaValidator `json:"properties"`
}

type JSONItemSchemaValidator struct {
	Type  string `json:"type"`
	Title string `json:"title"`
}

type ItemValue struct {
	GroupHref string      `json:"groupHref"`
	ItemName  string      `json:"itemName"`
	Value     interface{} `json:"value"`
}
