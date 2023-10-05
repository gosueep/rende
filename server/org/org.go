package org

import (
	"context"
	"fmt"
	"net/http"

	"rende/db"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type Org struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	PhotoURL    string `json:"photo_url"`
	// City string `json:"city"`
	// State string `json:"state"`
}

func GetOrgs(c *gin.Context) {
	var orgs []Org
	rows, _ := db.Conn.Query(context.Background(), "SELECT id, name, COALESCE(photo_url, '') from public.org")
	for rows.Next() {
		var org Org
		err := rows.Scan(&org.ID, &org.Name, &org.PhotoURL)
		if err != nil {
			fmt.Println(err)
		}
		orgs = append(orgs, org)
	}

	c.JSON(http.StatusOK, orgs)
}

// Get org with id in url parameter
func GetOrgById(c *gin.Context) {
	id := c.Param("id")
	var org Org
	err := db.Conn.QueryRow(context.Background(),
		"SELECT id, name, COALESCE(photo_url, '') from public.org WHERE id=$1", id).
		Scan(&org.ID, &org.Name, &org.PhotoURL)
	if err != nil {
		fmt.Println(err)
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusBadRequest, fmt.Sprintf(`Org id "%s" not found`, id))
		}
	} else {
		c.JSON(http.StatusOK, org)
	}
}

// Create org from post form
func CreateOrg(c *gin.Context) {

	var json struct {
		NewOrg Org `json:"org" binding:"required"`
	}

	err := c.BindJSON(&json)
	if err != nil {
		fmt.Println(err)
	}

	var newOrg Org = json.NewOrg

	commandTag, err := db.Conn.Exec(context.Background(),
		"INSERT INTO public.org (name, description, photo_url) VALUES ($1, $2, $3)",
		newOrg.Name, newOrg.Description, newOrg.PhotoURL)
	
	if err != nil {
		fmt.Println(commandTag, err)
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("Failed to create Org %s", db.Sad()))
	} else {
		c.JSON(http.StatusOK, fmt.Sprintf("Org successfully created %s", db.Happy()))
	}
}


// Create org from post form
func JoinOrg(c *gin.Context) {

	var json struct {
		uid string `json:"uid" binding: "required"`
		org_id string `json:"org_id" binding: "required"`
	}

	err := c.BindJSON(&json)
	if err != nil {
		fmt.Println(err)
	}

	commandTag, err := db.Conn.Exec(context.Background(),
		"INSERT INTO public.user_org_xref (user_id, org_id) VALUES ($1, $2)",
		json.uid, json.org_id)
	
	if err != nil {
		fmt.Println(commandTag, err)
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("Failed to join Org %s", db.Sad()))
	} else {
		c.JSON(http.StatusOK, fmt.Sprintf("Org successfully joined %s", db.Happy()))
	}
}