package org

import (
	"fmt"
	"context"
	"net/http"

	"rende/db"

	"github.com/gin-gonic/gin"
)

type Org struct {
	ID string `json:"id"`
	Name string `json:"name"`
	PhotoURL string `json:"photo_url"`
	// City string `json:"city"`
	// State string `json:"state"`
}

func GetOrgs(c *gin.Context) {
	var orgs []Org
	rows, _ := db.Conn.Query(context.Background(), "SELECT id, name, photo_url from orgs")
	for rows.Next() {
		var org Org
		_ = rows.Scan(&org.ID, &org.Name, &org.PhotoURL)
		orgs = append(orgs, org)
	}
	
	fmt.Println(orgs)
	c.JSON(http.StatusOK, orgs)
}


// Get org with id in url parameter
func GetOrgById(c *gin.Context) {
	id := c.Param("id")
	var org Org
	err := db.Conn.QueryRow(context.Background(), 
		"SELECT id, name, photo_url from orgs WHERE id=$1", id).
		Scan(&org.ID, &org.Name, &org.PhotoURL)
	if err != nil {
		fmt.Println(err)
	}

	c.JSON(http.StatusOK, org)
}


// Create org from post form
func CreateOrg(c *gin.Context) {
	var newOrg Org
	err := c.BindJSON(newOrg)
	if err != nil {
		fmt.Println(err)
	}

	db.Conn.Exec(context.Background(),
		"INSERT INTO orgs (name, photo_url) VALUES ($1, $2)",
		newOrg.Name, newOrg.PhotoURL)
}