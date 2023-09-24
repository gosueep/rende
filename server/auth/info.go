package auth

import (
	"fmt"
	"net/http"
	"context"

	"rende/db"

	"github.com/gin-gonic/gin"
)


func UpdateUserInfo(c *gin.Context) {
	var json struct {
		FirstName string `json:"first_name" binding:"required"`
		LastName string `json:"last_name" binding:"required"`
		Organization string `json:"org" binding:"required"`
	}

	err := c.BindJSON(&json)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, fmt.Sprintf("User update request malformed %s", db.Sad()))
		return
	}

	// Get userid
	userid, exists := c.Get("uid")
	if !exists {
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("User ID not found in request %s", db.Sad()))
		return
	}

	// Insert into db
	commandTag, err := db.Conn.Exec(context.Background(),
		`INSERT INTO public.users (id, first_name, last_name, org) 
		VALUES ($1, $2, $3, $4)`,
		userid, json.FirstName, json.LastName, json.Organization)
	if err != nil {
		fmt.Println(commandTag, err)
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("Failed updating info in database %s", db.Sad()))
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"msg": fmt.Sprintf("User successfully updated %s", db.Happy()),
	})
}


