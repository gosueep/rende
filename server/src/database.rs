use chrono::*;
use diesel::dsl;
use diesel::pg::{Pg, PgConnection};
use diesel::prelude::*;
use serde::de::Error;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::fmt::Display;
use std::ptr::null;
use std::{env, ptr};

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

#[derive(Queryable, Serialize, Deserialize)]
pub struct ClubJson {
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

// Serializable structs for JSON transer
#[derive(Queryable, Serialize, Deserialize)]
pub struct EventJson {
    pub id: i64,
    pub name: String,
    pub description_text: String,
    pub description_html: String,
    pub start: i64,
}

// Variable number of event images
diesel::table! {
    event_image (id) {
        id -> Int8,
        event_id -> Int8,
        index -> Int8,
        png -> Blob,
    }
}

#[derive(Queryable)]
pub struct EventImage {
    pub id: i64,
    pub event_id: i64,
    pub index: i64,
    pub png: Vec<u8>,
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
        email -> Varchar,
        password -> Varchar,
    }
}

#[derive(Queryable)]
pub struct User {
    pub id: i64,
    pub name: String,
    pub email: String,
    pub password: String,
}

#[derive(Queryable, Serialize, Deserialize)]
pub struct EventResultJson {
    pub events: Vec<EventJson>,
}

#[derive(Queryable, Serialize, Deserialize)]
pub struct ClubResultJson {
    pub clubs: Vec<ClubJson>,
}

pub fn create_database() -> PgConnection {
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let mut conn = PgConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url));

    // Create tables one by one
    diesel::sql_query(
        r#"
		CREATE TABLE IF NOT EXISTS club (
			id BIGINT primary key,
			name VARCHAR(256),
			description_text VARCHAR(256),
			description_html VARCHAR(256)
		)
	"#,
    )
    .execute(&mut conn)
    .unwrap();
    diesel::sql_query(
        r#"
		CREATE TABLE IF NOT EXISTS club_image (
			id BIGINT primary key,
			club_id BIGINT,
			index BIGINT,
			png BYTEA
		)
	"#,
    )
    .execute(&mut conn)
    .unwrap();
    diesel::sql_query(
        r#"
		CREATE TABLE IF NOT EXISTS club_organizer (
			id BIGINT primary key,
			club_id BIGINT,
			user_id BIGINT
		)
	"#,
    )
    .execute(&mut conn)
    .unwrap();
    diesel::sql_query(
        r#"
		CREATE TABLE IF NOT EXISTS event (
			id BIGINT primary key,
			club_id BIGINT,
			name VARCHAR(256),
			description_text VARCHAR(256),
			description_html VARCHAR(256),
			start TIMESTAMP
		)
	"#,
    )
    .execute(&mut conn)
    .unwrap();
    diesel::sql_query(
        r#"
		CREATE TABLE IF NOT EXISTS event_image (
			id BIGINT primary key,
			event_id BIGINT,
			index BIGINT,
			png BYTEA
		)
	"#,
    )
    .execute(&mut conn)
    .unwrap();
    diesel::sql_query(
        r#"
		CREATE TABLE IF NOT EXISTS event_category (
			id BIGINT primary key,
			event_id BIGINT,
			category VARCHAR(256)
		)
	"#,
    )
    .execute(&mut conn)
    .unwrap();
    diesel::sql_query(
        r#"
		CREATE TABLE IF NOT EXISTS event_rsvp (
			id BIGINT primary key,
			event_id BIGINT,
			user_id BIGINT
		)
	"#,
    )
    .execute(&mut conn)
    .unwrap();
    diesel::sql_query(
        r#"
		CREATE TABLE IF NOT EXISTS event_rsvp (
			id BIGINT primary key,
			event_id BIGINT,
			user_id BIGINT
		)
	"#,
    )
    .execute(&mut conn)
    .unwrap();
    diesel::sql_query(
        r#"
		CREATE TABLE IF NOT EXISTS event_organizer (
			id BIGINT primary key,
			event_id BIGINT,
			user_id BIGINT
		)
	"#,
    )
    .execute(&mut conn)
    .unwrap();
    diesel::sql_query(
        r#"
		CREATE TABLE IF NOT EXISTS "user" (
			id BIGINT primary key,
			name VARCHAR(256),
			email VARCHAR(256),
			password VARCHAR(256)
		)
	"#,
    )
    .execute(&mut conn)
    .unwrap();

    conn
}

pub fn get_all_events_api(conn: &mut PgConnection) -> Option<String> {
    // Query 10 events for now
    let result: Result<Vec<Event>, diesel::result::Error> = event::table.get_results(conn);
    if result.is_err() {
        print!("Diesel error {:?}\n", result.err());
        return None;
    }
    let events = result.unwrap();

    let events_result = EventResultJson {
        events: events
            .iter()
            .map(|event| EventJson {
                id: event.id,
                name: event.name.clone(),
                description_text: event.description_text.clone(),
                description_html: event.description_html.clone(),
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

fn get_num_rsvps_api(event_id: i64, conn: &mut PgConnection) -> Option<String> {
    // Query 10 events for now
    let result: Result<i64, diesel::result::Error> = event_rsvp::table
        .filter(event_rsvp::event_id.eq(event_id))
        .count()
        .get_result(conn);
    if result.is_err() {
        return None;
    }
    let num_rsvps = result.unwrap();

    let json = serde_json::to_string(&json!({ "num_rsvps": num_rsvps }));
    if json.is_err() {
        return None;
    }

    Some(json.unwrap())
}

pub fn get_club_image_api(id: i64, conn: &mut PgConnection) -> Option<Vec<u8>> {
    // Query for image
    let result: Result<EventImage, diesel::result::Error> = club_image::table
        .filter(club_image::id.eq(id))
        .get_result(conn);
    if result.is_err() {
        return None;
    }

    Some(result.unwrap().png)
}

pub fn get_all_clubs_api(conn: &mut PgConnection) -> Option<String> {
    // Query 10 clubs for now
    let result: Result<Vec<Club>, diesel::result::Error> = club::table.limit(10).get_results(conn);
    if result.is_err() {
        return None;
    }
    let events = result.unwrap();

    let events_result = ClubResultJson {
        clubs: events
            .iter()
            .map(|club| ClubJson {
                id: club.id,
                name: club.name.clone(),
                description_text: club.description_text.clone(),
                description_html: club.description_html.clone(),
            })
            .collect(),
    };

    let json = serde_json::to_string(&events_result);
    if json.is_err() {
        return None;
    }

    Some(json.unwrap())
}

pub fn get_event_api(id: i64, conn: &mut PgConnection) -> Option<String> {
    // Query 10 events for now
    let result: Result<Event, diesel::result::Error> =
        event::table.filter(event::id.eq(id)).get_result(conn);
    if result.is_err() {
        return None;
    }
    let event = result.unwrap();

    let json = serde_json::to_string(&EventJson {
        id: event.id,
        name: event.name.clone(),
        description_text: event.description_text.clone(),
        description_html: event.description_html.clone(),
        start: event.start.timestamp(),
    });
    if json.is_err() {
        return None;
    }

    Some(json.unwrap())
}

// Query newest events in order
pub fn get_newest_events_api(num: i64, conn: &mut PgConnection) -> Option<String> {
    let result: Result<Event, diesel::result::Error> = event::table
        .order(event::start.desc())
        .limit(num)
        .get_result(conn);
    if result.is_err() {
        return None;
    }
    let event = result.unwrap();

    let json = serde_json::to_string(&EventJson {
        id: event.id,
        name: event.name.clone(),
        description_text: event.description_text.clone(),
        description_html: event.description_html.clone(),
        start: event.start.timestamp(),
    });
    if json.is_err() {
        return None;
    }

    Some(json.unwrap())
}

// Add event with data, return id
pub fn add_event_api(data: String, conn: &mut PgConnection) -> Option<String> {
    let event_struct_res: Result<EventJson, serde_json::Error> =
        serde_json::from_str(&data.as_str());
    if event_struct_res.is_err() {
        print!("Serde error {:?}\n", event_struct_res.err());
        return None;
    }
    let event_struct = event_struct_res.unwrap();

    let time = NaiveDateTime::from_timestamp_millis(event_struct.start);
    if time.is_none() {
        return None;
    }

    let new_id_res: Result<Option<i64>, diesel::result::Error> =
        event::table.select(dsl::max(event::id)).get_result(conn);
    if new_id_res.is_err() {
        print!("Diesel error {:?}\n", new_id_res.err());
        return None;
    }
    let new_id_option = new_id_res.unwrap();

    // Get max + 1 if there are other rows, otherwise return 1
    let new_id = if new_id_option.is_some() {
        new_id_option.unwrap() + 1
    } else {
        1
    };

    let result: Result<i64, diesel::result::Error> = diesel::insert_into(event::table)
        .values((
            event::id.eq(new_id),
            event::name.eq(event_struct.name),
            event::description_text.eq(event_struct.description_text),
            event::description_html.eq(event_struct.description_html),
            event::start.eq(time.unwrap()),
        ))
        .returning(event::id)
        .get_result(conn);
    if result.is_err() {
        print!("Diesel error {:?}\n", result.err());
        return None;
    }
    let event_id = result.unwrap();

    Some(serde_json::to_string(&json!({ "event_id": event_id })).unwrap())
}

// Add club with data, return id
pub fn add_club_api(data: String, conn: &mut PgConnection) -> Option<String> {
    let club_struct_res: Result<ClubJson, serde_json::Error> = serde_json::from_str(&data.as_str());
    if club_struct_res.is_err() {
        print!("Serde error {:?}\n", club_struct_res.err());
        return None;
    }
    let club_struct = club_struct_res.unwrap();

    let new_id_res: Result<Option<i64>, diesel::result::Error> =
        club::table.select(dsl::max(club::id)).get_result(conn);
    if new_id_res.is_err() {
        print!("Diesel error {:?}\n", new_id_res.err());
        return None;
    }
    let new_id_option = new_id_res.unwrap();

    // Get max + 1 if there are other rows, otherwise return 1
    let new_id = if new_id_option.is_some() {
        new_id_option.unwrap() + 1
    } else {
        1
    };

    let result: Result<i64, diesel::result::Error> = diesel::insert_into(club::table)
        .values((
            club::id.eq(new_id),
            club::name.eq(club_struct.name),
            club::description_text.eq(club_struct.description_text),
            club::description_html.eq(club_struct.description_html),
        ))
        .returning(club::id)
        .get_result(conn);
    if result.is_err() {
        print!("Diesel error {:?}\n", result.err());
        return None;
    }
    let club_id = result.unwrap();

    Some(serde_json::to_string(&json!({ "club_id": club_id })).unwrap())
}

// Clear all events
pub fn clear_events_api(conn: &mut PgConnection) -> Result<usize, diesel::result::Error> {
    diesel::delete(event::table).execute(conn)
}

// Clear all clubs
pub fn clear_clubs_api(conn: &mut PgConnection) -> Result<usize, diesel::result::Error> {
    diesel::delete(club::table).execute(conn)
}
