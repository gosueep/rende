package main

import (
	"context"
	"log"
	"os"

	"rende/db"
	"rende/event"
	"rende/org"
	"rende/auth"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"

	supa "github.com/nedpals/supabase-go"
)

func main() {
	// Load Environment file
	err := godotenv.Load()
	if err != nil {log.Fatal("Error loading .env file")}

	// Setup DB connection
	db.Conn, err = pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {log.Fatal("Error connecting to Database, check environment credentials in .env", err)}

	// setup supabase
	supabaseURL := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_KEY")
	auth.Supabase = supa.CreateClient(supabaseURL, supabaseKey)
	auth.JWT_SECRET = []byte(os.Getenv("JWT_SECRET"))


	// Router
	router := gin.Default()

	router.Use(cors.Default())
	// router.Use(cors.New(cors.Config{
	// 	AllowOrigins: ,
	// }))


	router.Use(static.Serve("/", static.LocalFile("../dist", false)))
	router.NoRoute(func(c *gin.Context) {
		c.Request.URL.Path = "/"
		router.HandleContext(c)
	})


	api := router.Group("api") 
	{
		// Orgs
		api.POST("get_orgs", org.GetOrgs)
		api.GET("get_org/:id", org.GetOrgById)
		api.POST("get_org/:id", org.GetOrgById)
		
		// Events
		api.POST("get_event/:id", event.GetEvent)
		api.GET("get_events_by_org/:org_id", event.GetEventsByOrg)
		api.POST("get_events_by_org/:org_id", event.GetEventsByOrg)
		api.GET("get_latest_events/:amount", event.GetLatestEvents)
		api.POST("get_latest_events/:amount", event.GetLatestEvents)
		
		// User
		api.POST("login", auth.UserLogin)
		api.POST("register", auth.RegisterUser)
		
		// Auth Routes
		authRoutes := api.Group("/", auth.CheckAuth())
		{
			// Create / edit Orgs
			authRoutes.POST("create_org", org.CreateOrg)
			authRoutes.POST("edit_org")
			
			// Post/edit events
			authRoutes.POST("post_event", event.PostEvent)
			authRoutes.POST("edit_event")

			// Update User Info
			authRoutes.POST("update_user", auth.UpdateUserInfo)

			authRoutes.POST("logout", auth.UserLogout)
		}
	}

	// Don't trust all proxies

	router.Run("localhost:8000")
}