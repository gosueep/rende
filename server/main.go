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
	"github.com/gin-contrib/static"

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

	// Add auth middleware

	// router.NoRoute()
	router.Use(static.Serve("/", static.LocalFile("../public", false)))


	api := router.Group("api") 
	{
		// Orgs
		api.POST("get_orgs", org.GetOrgs)
		api.GET("get_org/:id", org.GetOrgById)
		api.POST("get_org/:id", org.GetOrgById)
		api.POST("create_org", org.CreateOrg)
		api.POST("edit_org")

		// Events
		api.POST("get_event/:id", event.GetEvent)
		api.GET("get_events_by_org/:org_id", event.GetEventsByOrg)
		api.POST("get_events_by_org/:org_id", event.GetEventsByOrg)
		api.GET("get_latest_events/:amount", event.GetLatestEvents)
		api.POST("get_latest_events/:amount", event.GetLatestEvents)
		api.POST("post_event", event.PostEvent)
		api.POST("edit_event")

		// User
		api.POST("api_login")
		api.POST("api_register")
	}
	
	// TODODODODOD

	// Don't trust all proxies

	router.Run("localhost:8000")
}