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
		
		// TODO - MAKE MORE SECURE LATER - HTTP only, path and domain
		c.SetCookie("token", user.AccessToken, 3600, "", "", true, false)

		c.JSON(http.StatusOK, gin.H{
			"msg": fmt.Sprintf("User successfully signed in %s", db.Happy()),
			"user": user,
		})
	}
}

func UserLogout(c *gin.Context) {
	// Set token to an expired cookie
	c.SetCookie("token", "", -1, "", "", true, false)
	
	// Get token string
	tokenString, exists := c.Get("tokenString")
	if !exists {
		fmt.Println("Token required to logout")
		c.AbortWithStatusJSON(http.StatusUnauthorized, "You must provide a token")
		return
	}
	
	// Sign-out user
	err := Supabase.Auth.SignOut(context.Background(), tokenString.(string))
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("Failed signing in user %s \n%s", db.Sad(), err))
	} else {
		c.JSON(http.StatusOK, fmt.Sprintf("User successfully signed out %s", db.Happy()))
	}
}