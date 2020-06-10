package main

import (
	"fmt"
	"item"
	"log"

	"github.com/gin-gonic/gin"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	item.DBInit()
	router := gin.Default()
	router.LoadHTMLGlob("view/*html")
	router.GET("/", func(ctx *gin.Context) {
		log.Println("main logic")
		ctx.HTML(302, "index.html", gin.H{})
	})

	router.Static("static", "./static")

	router.GET("/items", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{"items": item.GetItems()})
	})
	router.POST("/upload_text", func(ctx *gin.Context) {
		fmt.Print("きた\n")
		fmt.Println(ctx.PostForm("input_text"))
		item.InsertTextItem(item.Text, ctx.PostForm("input_text"))
		items := item.GetItems()
		displayItems(items)
	})

	router.POST("/clear", func(ctx *gin.Context) {
		item.DeleteItems()
	})

	items := item.GetItems()
	displayItems(items)
	router.Run()
}

func displayItems(items []item.Item) {
	for _, item := range items {
		fmt.Printf("ID:%d Type:%d Text:%s\n", item.ID, item.Type, item.Text)
	}
}
