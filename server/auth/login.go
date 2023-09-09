package auth

import (
	"fmt"
	"net/http"
	"context"

	"rende/db"

	"github.com/gin-gonic/gin"

	supa "github.com/nedpals/supabase-go"
)


func UserLogin(c *gin.Context) {
	var json struct {
		// Username string `json:"username" binding:"required"`	
		Password string `json:"password" binding:"required"`
		Email string `json:"email" binding:"required"`
	}

	err := c.BindJSON(&json)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, fmt.Sprintf("User login request malformed %s", db.Sad()))
		return
	} 

	// Sign-in user to Supabase
	user, err := Supabase.Auth.SignIn(context.Background(), supa.UserCredentials{
		Email:    json.Email,
		Password: json.Password,
	})
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("Failed signing in user %s \n%s", db.Sad(), err))
	} else {
		c.JSON(http.StatusOK, gin.H{
			"msg": fmt.Sprintf("User successfully signed in %s", db.Happy()),
			"user": user,
		})
	}
}
