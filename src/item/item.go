package item

import (
	"log"

	"github.com/jinzhu/gorm"
)

const (
	Text      = iota
	TextFile  = iota
	ImageFile = iota
)

type Item struct {
	gorm.Model
	Type     int
	Text     string
	FilePath string
}

func DBInit() {
	db, err := gorm.Open("sqlite3", "item.sqlite3")
	if err != nil {
		log.Fatal(err)
	}
	db.AutoMigrate(&Item{})
	defer db.Close()
}

func InsertTextItem(itemType int, itemText string) {
	db, err := gorm.Open("sqlite3", "item.sqlite3")
	if err != nil {
		log.Fatal(err)
	}
	db.Create(&Item{Type: itemType, Text: itemText})
	defer db.Close()
}

func GetItems() []Item {
	db, err := gorm.Open("sqlite3", "item.sqlite3")
	if err != nil {
		log.Fatal(err)
	}
	var items []Item
	db.Find(&items)
	return items
}
