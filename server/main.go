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

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	cognito "github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
)

func main() {
	// Load Environment file
	err := godotenv.Load()
	if err != nil {log.Fatal("Error loading .env file")}

	// Setup DB connection
	db.Conn, err = pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {log.Fatal("Error connecting to Database, check environment credentials in .env", err)}

	// setup AWS
	conf := &aws.Config{Region: aws.String(os.Getenv("COGNITO_REGION"))}
	sess, err := session.NewSession(conf)
	if err != nil {log.Fatal("Error creating AWS Session")}
	auth.Cognito = auth.CognitoInfo{
		Client: cognito.New(sess),
		UserPoolID: os.Getenv("COGNITO_USER_POOL_ID"),
		AppClientID: os.Getenv("COGNITO_APP_CLIENT_ID"),
		AppClientSecret: os.Getenv("COGNITO_APP_CLIENT_SECRET"),
	}


	// Router
	router := gin.Default()

	router.Use(cors.Default())
	// router.Use(cors.New(cors.Config{
	// 	AllowOrigins: ,
	// }))

	// Add auth middleware

	router.Use(static.Serve("/", static.LocalFile("../public", false)))
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
		api.POST("login")
		api.POST("register", auth.RegisterUser)
	}
	
	// TODODODODOD

	// Don't trust all proxies

	router.Run("localhost:8000")
}