package main

import (
	"context"
	"log"
	"os"

	"rende/db"
	"rende/event"
	"rende/org"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
		return
	}

	db.Conn, err = pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal("Error connecting to Database, check environment credentials")
	}

	router := gin.Default()

	router.Use(cors.Default())
	// router.Use(cors.New(cors.Config{
	// 	AllowOrigins: ,
	// }))

	// Orgs
	router.POST("get_orgs", org.GetOrgs)
	router.GET("get_org/:id", org.GetOrgById)
	router.POST("get_org/:id", org.GetOrgById)
	router.POST("create_org", org.CreateOrg)
	router.POST("edit_org")

	// Events
	router.POST("get_event/:id", event.GetEvent)
	router.GET("get_events_by_org/:org_id", event.GetEventsByOrg)
	router.POST("get_events_by_org/:org_id", event.GetEventsByOrg)
	router.GET("get_latest_events/:amount", event.GetLatestEvents)
	router.POST("get_latest_events/:amount", event.GetLatestEvents)
	router.POST("post_event", event.PostEvent)
	router.POST("edit_event")

	// User
	router.POST("api_login")
	router.POST("api_register")

	
	// TODODODODOD

	// Don't trust all proxies

	router.Run("localhost:8000")
}