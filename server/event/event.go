package event

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"rende/db"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type Event struct {
	ID          string    `json:"id"`
	Org_id      string    `json:"org_id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Location    string    `json:"location"`
	Date        time.Time `json:"date"`
	PhotoURL    string    `json:"photo_url"`
	IsRecurring bool      `json:"is_recurring"`
}

func GetEvent(c *gin.Context) {

	// VALIDATE IF NO EVENT RETURNED

	id := c.Param("id")
	var event Event
	err := db.Conn.QueryRow(context.Background(),
		`SELECT id, org_id, name, description, 
			COALESCE(location, ''), date, COALESCE(photo_url, ''), is_recurring 
		FROM event 
		WHERE id=$1`,
		id).Scan(&event.ID, &event.Org_id, &event.Name, &event.Description, &event.Location, &event.Date, &event.PhotoURL, &event.IsRecurring)
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusBadRequest, fmt.Sprintf(`Event id %s not found`, id))
		} else {
			c.JSON(http.StatusBadRequest, "Bad Request")
			fmt.Println(err)
		}
	} else {
		c.JSON(http.StatusOK, event)
	}
}

func GetLatestEvents(c *gin.Context) {
	numEvents := c.Param("amount")
	var events []Event
	rows, err := db.Conn.Query(context.Background(),
		`SELECT id, org_id, name, description, COALESCE(location, ''), date, COALESCE(photo_url, ''), is_recurring 
		FROM event 
		ORDER BY date DESC 
		LIMIT $1`, numEvents)
	if err != nil {
		fmt.Println(err)
	}

	fmt.Println(rows)

	for rows.Next() {
		var event Event
		err := rows.Scan(&event.ID, &event.Org_id, &event.Name, &event.Description, &event.Location,
			&event.Date, &event.PhotoURL, &event.IsRecurring)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(event)
		events = append(events, event)
	}

	fmt.Println("Events:", events)
	c.JSON(http.StatusOK, events)
}

func GetEventsByOrg(c *gin.Context) {

	org_id := c.Param("org_id")
	// var json struct {
	// 	Org_id string `json:"org_id"`
	// }
	// err := c.BindJSON(&json)
	// if err != nil {
	// 	fmt.Println(err)
	// }
	// org_id := json.Org_id

	fmt.Println(org_id)

	var events []Event
	rows, _ := db.Conn.Query(context.Background(),
		`SELECT id, name, location, date, photo_url 
		FROM event WHERE org_id=$1`,
		org_id)
	for rows.Next() {
		var event Event
		err := rows.Scan(&event.ID, &event.Name, &event.Location, &event.Date, &event.PhotoURL)
		if err != nil {
			fmt.Println(err)
		}
		events = append(events, event)
	}
	c.JSON(http.StatusOK, events)
}

// Create Event
func PostEvent(c *gin.Context) {

	var json struct {
		NewEvent Event `json:"event" binding:"required"`
	}

	err := c.Bind(&json)
	if err != nil {
		fmt.Println(err)
	}

	var newEvent Event = json.NewEvent

	db.Conn.Exec(context.Background(),
		`INSERT INTO event (org_id, name, description, date, photo_url, is_recurring) 
		VALUES ($1, $2, $3, $4, $5, $6)`,
		newEvent.Org_id, newEvent.Name, newEvent.Description, newEvent.Date, newEvent.PhotoURL, newEvent.IsRecurring)
}
