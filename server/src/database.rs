use chrono::*;
use diesel::pg::{Pg, PgConnection};
use diesel::prelude::*;
use serde::de::Error;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::env;

// Overarching club (some events are a part of clubs, some aren't)
diesel::table! {
    club (id) {
        id -> Int8,
        name -> Varchar,
        description_text -> Varchar,
        description_html -> Varchar,
    }
}

#[derive(Queryable)]
pub struct Club {
    pub id: i64,
    pub name: String,
    pub description_text: String,
    pub description_html: String,
}

// Variable number of club images
diesel::table! {
    club_image (id) {
        id -> Int8,
        club_id -> Int8,
        index -> Int8,
        png -> Blob,
    }
}

#[derive(Queryable)]
pub struct ClubImage {
    pub id: i64,
    pub club_id: i64,
    pub index: i64,
    pub png: Vec<u8>,
}

// Variable number of club organizers, some may have more permissions (TODO)
diesel::table! {
    club_organizer (id) {
        id -> Int8,
        club_id -> Int8,
        user_id -> Int8,
    }
}

#[derive(Queryable)]
pub struct ClubOrganizer {
    pub id: i64,
    pub club_id: i64,
    pub user_id: i64,
}

// A specific event, which may be under a club
diesel::table! {
    event (id) {
        id -> Int8,
        club_id -> Nullable<Int8>,
        name -> Varchar,
        description_text -> Varchar,
        description_html -> Varchar,
        start -> Timestamp,
    }
}

#[derive(Queryable)]
pub struct Event {
    pub id: i64,
    pub club_id: Option<i64>,
    pub name: String,
    pub description_text: String,
    pub description_html: String,
    pub start: NaiveDateTime,
}

// An event category, every event can have as many categories as neccesary
diesel::table! {
    event_category (id) {
        id -> Int8,
        event_id -> Int8,
        category -> Varchar,
    }
}

#[derive(Queryable)]
pub struct EventCategory {
    pub id: i64,
    pub event_id: i64,
    pub category: String,
}

// An event rsvp, different tiers of rsvps
diesel::table! {
    event_rsvp (id) {
        id -> Int8,
        event_id -> Int8,
        user_id -> Int8,
    }
}

#[derive(Queryable)]
pub struct EventRsvp {
    pub id: i64,
    pub event_id: i64,
    pub user_id: i64,
}

// Variable number of event organizers, some may have more permissions (TODO)
diesel::table! {
    event_organizer (id) {
        id -> Int8,
        event_id -> Int8,
        user_id -> Int8,
    }
}

#[derive(Queryable)]
pub struct EventOrganizer {
    pub id: i64,
    pub event_id: i64,
    pub user_id: i64,
}

// Users, some of which are organizers
diesel::table! {
    user (id) {
        id -> Int8,
        name -> Varchar,
    }
}

#[derive(Queryable)]
pub struct User {
    pub id: i64,
    pub name: String,
}

// Serializable structs for JSON transer
#[derive(Queryable, Serialize, Deserialize)]
pub struct EventJson {
    pub name: String,
    pub description: String,
    pub start: i64,
}

#[derive(Queryable, Serialize, Deserialize)]
pub struct EventResultJson {
    pub events: Vec<EventJson>,
}

async fn create_database() -> PgConnection {
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

async fn get_all_events(conn: &mut PgConnection) -> Option<Vec<Event>> {
    let result = event::table.limit(10).get_results::<Event>(conn);
    if let Ok(events) = result {
        Some(events)
    } else {
        None
    }
}

async fn get_all_events_json(conn: &mut PgConnection) -> Option<String> {
    // Query 10 events for now
    let result: Result<Vec<Event>, diesel::result::Error> =
        event::table.limit(10).get_results(conn);
    if result.is_err() {
        return None;
    }
    let events = result.unwrap();

    let events_result = EventResultJson {
        events: events
            .iter()
            .map(|event| EventJson {
                name: event.name.clone(),
                description: event.description_text.clone(),
                start: event.start.timestamp(),
            })
            .collect(),
    };

    let json = serde_json::to_string(&events_result);
    if json.is_err() {
        return None;
    }

    Some(json.unwrap())
}
