package item

import (
	"log"
	"text/template"

	"github.com/jinzhu/gorm"
)

const (
	Text      = iota
	TextFile  = iota
	ImageFile = iota
)

type Item struct {
	gorm.Model
	Type     int    `json:"type"`
	Text     string `json:"text"`
	FilePath string `json:"filepath"`
}

func DBInit() {
	db, err := gorm.Open("sqlite3", "items.sqlite3")
	if err != nil {
		log.Fatal(err)
	}
	db.AutoMigrate(&Item{})
	defer db.Close()
}

func InsertTextItem(itemType int, itemText string) {
	escapedText := template.HTMLEscapeString(itemText)
	db, err := gorm.Open("sqlite3", "items.sqlite3")
	if err != nil {
		log.Fatal(err)
	} else {
		for {
			if err := db.Create(&Item{Type: itemType, Text: escapedText}).Error; err == nil {
				break
			}
		}
	}
	defer db.Close()
}

func GetItems() []Item {
	db, err := gorm.Open("sqlite3", "items.sqlite3")
	if err != nil {
		log.Fatal(err)
	}
	var items []Item
	db.Find(&items)
	defer db.Close()
	return items
}

func DeleteItems() {
	db, err := gorm.Open("sqlite3", "items.sqlite3")
	if err != nil {
		log.Fatal(err)
	}
	var items []Item
	db.Delete(&items)
	defer db.Close()
}
