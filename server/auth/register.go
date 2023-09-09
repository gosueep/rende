package auth

import (
	"fmt"
	"net/http"
	"context"

	"rende/db"
	// "rende/event"
	// "rende/org"

	"github.com/gin-gonic/gin"
	supa "github.com/nedpals/supabase-go"
)


func RegisterUser(c *gin.Context) {
	var json struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
		Email string `json:"email" binding:"required"`
		Name string `json:"name" binding:"required"`
		Organization string `json:"org"`
	}

	err := c.BindJSON(&json)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, fmt.Sprintf("User creation request malformed %s", db.Sad()))
		return
	} 

	// User to be created
	user, err := Supabase.Auth.SignUp(context.Background(), supa.UserCredentials{
		Email:    json.Email,
		Password: json.Password,
	})
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("Failed creating user %s \n%s", db.Sad(), err))
	} else {
		c.JSON(http.StatusOK, gin.H{
			"msg": fmt.Sprintf("User successfully created %s", db.Happy()),
			"user": user,
		})
	}
}
