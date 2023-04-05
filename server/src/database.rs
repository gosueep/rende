// use actix_web::web::{Bytes, BytesMut, Data, Json, Path, Payload};
use chrono::*;
use diesel::dsl;
use diesel::pg::{PgConnection};
use diesel::prelude::*;
// use serde::de::Error;
use serde::{Deserialize, Serialize};
use serde_json::{json};
// use std::fmt::Display;
// use std::ptr::null;
// use std::sync::{Arc, Mutex, RwLock};
use std::{env};

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

#[derive(Queryable, Serialize, Deserialize)]
pub struct PostClubJson {
    pub name: String,
    pub description: String,
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
        location_id -> Int8,
        name -> Varchar,
        description_text -> Varchar,
        description_html -> Varchar,
        start -> Timestamp,
        is_recurring -> Bool,
    }
}

#[derive(Queryable)]
pub struct Event {
    pub id: i64,
    pub club_id: Option<i64>,
    pub location_id: i64,
    pub name: String,
    pub description_text: String,
    pub description_html: String,
    pub start: NaiveDateTime,
    pub is_recurring: bool,
}

// Serializable structs for JSON transer
#[derive(Queryable, Serialize, Deserialize)]
pub struct EventJson {
    pub id: i64,
    pub club_id: Option<i64>,
    pub location_id: i64,
    pub name: String,
    pub description_text: String,
    pub description_html: String,
    pub start: i64,
    pub is_recurring: bool,
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

#[derive(Queryable, Serialize, Deserialize)]
pub struct EventImageJson {
    pub id: i64,
    pub index: i64,
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

#[derive(Queryable, Serialize, Deserialize)]
pub struct EventCategoryJson {
    pub id: i64,
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

#[derive(Queryable, Serialize, Deserialize)]
pub struct EventRsvpJson {
    pub id: i64,
    pub user_id: i64,
}

// JSON storing all event info
#[derive(Queryable, Serialize, Deserialize)]
pub struct EventFullJson {
    pub info: EventJson,
    pub images: Vec<EventImageJson>,
    pub categories: Vec<EventCategoryJson>,
    pub rsvps: Vec<EventRsvpJson>,
}

// JSON used for posting event
#[derive(Queryable, Serialize, Deserialize)]
pub struct EventPostJson {
    pub club_id: Option<i64>,
    pub location_id: i64,
    pub name: String,
    pub description: String,
    pub start: i64,
    pub categories: Vec<String>,
    pub is_recurring: bool,
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
        password_hash -> Varchar,
    }
}

#[derive(Queryable)]
pub struct User {
    pub id: i64,
    pub name: String,
    pub email: String,
    pub password: String,
}

// Locations
diesel::table! {
    location (id) {
        id -> Int8,
        description -> Varchar,
    }
}

#[derive(Queryable)]
pub struct Location {
    pub id: i64,
    pub description: String,
}

#[derive(Queryable, Serialize, Deserialize)]
pub struct LocationJson {
    pub id: i64,
    pub description: String,
}

#[derive(Queryable, Serialize, Deserialize)]
pub struct LocationPostJson {
    pub description: String,
}

#[derive(Queryable, Serialize, Deserialize)]
pub struct EventsResultJson {
    pub events: Vec<EventFullJson>,
}

#[derive(Queryable, Serialize, Deserialize)]
pub struct ClubsResultJson {
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
            location_id BIGINT,
			name VARCHAR(256),
			description_text VARCHAR(256),
			description_html VARCHAR(256),
			start TIMESTAMP,
            is_recurring BOOLEAN
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
			password_hash VARCHAR(256)
		)
	"#,
    )
    .execute(&mut conn)
    .unwrap();
    diesel::sql_query(
        r#"
        CREATE TABLE IF NOT EXISTS location (
            id BIGINT primary key,
            description VARCHAR(256),
            UNIQUE(description)
        )
    "#,
    )
    .execute(&mut conn)
    .unwrap();

    // Add indices
    diesel::sql_query(
        r#"
        CREATE INDEX IF NOT EXISTS idx_event_start ON event(start)
    "#,
    )
    .execute(&mut conn)
    .unwrap();

    conn
}

pub fn login_user_api(email: &str, password_hash: &str, conn: &mut PgConnection) -> Option<String> {
    // Look for user with these credentials
    let result: Result<User, diesel::result::Error> = user::table
        .filter(
            user::email
                .eq(email)
                .and(user::password_hash.eq(password_hash)),
        )
        .get_result(conn);
    if result.is_err() {
        let login_err = result.err().unwrap();
        if login_err == diesel::NotFound {
            // Just create account for now, life is too short for this
            let new_id_res: Result<Option<i64>, diesel::result::Error> =
                user::table.select(dsl::max(user::id)).get_result(conn);
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

            let result: Result<i64, diesel::result::Error> = diesel::insert_into(user::table)
                .values((
                    user::id.eq(new_id),
                    user::name.eq(email.clone()),
                    user::email.eq(email),
                    user::password_hash.eq(password_hash),
                ))
                .returning(user::id)
                .get_result(conn);

            if result.is_err() {
                println!("Diesel error {:?}", result.err());
                return None;
            }
            let user_id = result.unwrap();

            return Some(serde_json::to_string(&json!({ "id": user_id })).unwrap());
        } else {
            // Another error
            return None;
        }
    }
    let user = result.unwrap();

    Some(serde_json::to_string(&json!({ "id": user.id })).unwrap())
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
    let result: Result<ClubImage, diesel::result::Error> = club_image::table
        .filter(club_image::id.eq(id))
        .get_result(conn);
    if result.is_err() {
        return None;
    }

    Some(result.unwrap().png)
}

pub fn get_event_image_api(id: i64, conn: &mut PgConnection) -> Option<Vec<u8>> {
    // Query for image
    let result: Result<EventImage, diesel::result::Error> = event_image::table
        .filter(event_image::id.eq(id))
        .get_result(conn);
    if result.is_err() {
        return None;
    }

    Some(result.unwrap().png)
}

pub fn get_all_clubs_api(conn: &mut PgConnection) -> Option<String> {
    // Query 10 clubs for now
    let result: Result<Vec<Club>, diesel::result::Error> = club::table.get_results(conn);
    if result.is_err() {
        return None;
    }
    let events = result.unwrap();

    let events_result = ClubsResultJson {
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
        print!("Serde error {:?}\n", json.err());
        return None;
    }

    Some(json.unwrap())
}

pub fn get_full_event_json(event: Event, conn: &mut PgConnection) -> Option<EventFullJson> {
    let mut full_json = EventFullJson {
        info: EventJson {
            id: event.id,
            club_id: event.club_id,
            location_id: event.location_id,
            name: event.name,
            description_text: event.description_text,
            description_html: event.description_html,
            start: event.start.timestamp_millis(),
            is_recurring: event.is_recurring,
        },
        images: vec![],
        categories: vec![],
        rsvps: vec![],
    };

    // Get all images for this event
    let result: Result<Vec<EventImage>, diesel::result::Error> = event_image::table
        .filter(event_image::event_id.eq(event.id))
        .order(event_image::index.asc())
        .get_results(conn);
    if result.is_err() {
        return None;
    }
    let images = result.unwrap();
    for image in images {
        full_json.images.push(EventImageJson {
            id: image.id,
            index: image.index,
        });
    }

    // Get all categories for this event
    let result: Result<Vec<EventCategory>, diesel::result::Error> = event_category::table
        .filter(event_category::event_id.eq(event.id))
        .get_results(conn);
    if result.is_err() {
        return None;
    }
    let categories = result.unwrap();
    for category in categories {
        full_json.categories.push(EventCategoryJson {
            id: category.id,
            category: category.category,
        });
    }

    // Get all rsvps for this event
    let result: Result<Vec<EventRsvp>, diesel::result::Error> = event_rsvp::table
        .filter(event_rsvp::event_id.eq(event.id))
        .get_results(conn);
    if result.is_err() {
        return None;
    }
    let rsvps = result.unwrap();
    for rsvp in rsvps {
        full_json.rsvps.push(EventRsvpJson {
            id: rsvp.id,
            user_id: rsvp.user_id,
        });
    }

    Some(full_json)
}

pub fn get_event_api(id: i64, conn: &mut PgConnection) -> Option<String> {
    // Query 10 events for now
    let result: Result<Event, diesel::result::Error> =
        event::table.filter(event::id.eq(id)).get_result(conn);
    if result.is_err() {
        return None;
    }
    let event = result.unwrap();

    let full_json = get_full_event_json(event, conn);
    if full_json.is_none() {
        return None;
    }

    let json = serde_json::to_string(&full_json.unwrap());
    if json.is_err() {
        return None;
    }

    Some(json.unwrap())
}

pub fn get_club_by_organizer_api(user_id: i64, conn: &mut PgConnection) -> Option<String> {
    let result: Result<ClubOrganizer, diesel::result::Error> = club_organizer::table
        .filter(club_organizer::user_id.eq(user_id))
        .get_result(conn);

    if result.is_err() {
        return None;
    }
    let club_organizer = result.unwrap();

    let json = serde_json::to_string(&json!({ "club": club_organizer.club_id}));
    if json.is_err() {
        return None;
    }

    Some(json.unwrap())
}

// Query newest events in order
pub fn get_newest_events_api(num: i64, conn: &mut PgConnection) -> Option<String> {
    let result: Result<Vec<Event>, diesel::result::Error> = event::table
        .order(event::start.desc())
        .limit(num)
        .get_results(conn);
    if result.is_err() {
        println!("Diesel error {:?}", result.err());
        return None;
    }
    let events = result.unwrap();

    let mut list_json = EventsResultJson { events: vec![] };
    for event in events {
        let full_json = get_full_event_json(event, conn);
        if full_json.is_none() {
            return None;
        }

        list_json.events.push(full_json.unwrap());
    }

    let json = serde_json::to_string(&list_json);
    if json.is_err() {
        println!("Serde error {:?}", json.err());
        return None;
    }

    Some(json.unwrap())
}

// Add event with data, return id
pub fn add_event_api(data: String, conn: &mut PgConnection) -> Option<String> {
    let event_struct_res: Result<EventPostJson, serde_json::Error> =
        serde_json::from_str(&data.as_str());
    if event_struct_res.is_err() {
        print!("Serde error {:?}\n", event_struct_res.err());
        return None;
    }
    let event_struct = event_struct_res.unwrap();

    // Get current time
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

    // Insert event itself
    let result: Result<i64, diesel::result::Error> = diesel::insert_into(event::table)
        .values((
            event::id.eq(new_id),
            event::club_id.eq(event_struct.club_id),
            event::location_id.eq(event_struct.location_id),
            event::name.eq(event_struct.name),
            event::description_text.eq(event_struct.description.clone()),
            event::description_html.eq(event_struct.description),
            event::start.eq(time.unwrap()),
            event::is_recurring.eq(event_struct.is_recurring),
        ))
        .returning(event::id)
        .get_result(conn);
    if result.is_err() {
        print!("Diesel error {:?}\n", result.err());
        return None;
    }
    let event_id = result.unwrap();

    // Insert all categories
    for category in event_struct.categories {
        let new_id_res: Result<Option<i64>, diesel::result::Error> = event_category::table
            .select(dsl::max(event_category::id))
            .get_result(conn);
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

        let result: Result<usize, diesel::result::Error> =
            diesel::insert_into(event_category::table)
                .values((
                    event_category::id.eq(new_id),
                    event_category::event_id.eq(event_id),
                    event_category::category.eq(category),
                ))
                .execute(conn);
        if result.is_err() {
            print!("Diesel error {:?}\n", result.err());
            return None;
        }
    }

    Some(serde_json::to_string(&json!({ "event_id": event_id })).unwrap())
}

// Add club image, return id
pub fn add_club_image_api(club_id: i64, data: Vec<u8>, conn: &mut PgConnection) -> Option<String> {
    let new_id_res: Result<Option<i64>, diesel::result::Error> = club_image::table
        .select(dsl::max(club_image::id))
        .get_result(conn);
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

    // Determine if an club with this id even exists
    let num_clubs_id: Result<i64, diesel::result::Error> = club::table
        .filter(club::id.eq(club_id))
        .count()
        .get_result(conn);
    if num_clubs_id.is_err() || num_clubs_id.unwrap() == 0 {
        return None;
    }

    // Get index
    let club_image_index_res: Result<i64, diesel::result::Error> = club_image::table
        .filter(club_image::club_id.eq(club_id))
        .count()
        .get_result(conn);
    if club_image_index_res.is_err() {
        return None;
    }
    let club_image_index = club_image_index_res.unwrap();

    let result: Result<i64, diesel::result::Error> = diesel::insert_into(club_image::table)
        .values((
            club_image::id.eq(new_id),
            club_image::club_id.eq(club_id),
            club_image::index.eq(club_image_index),
            club_image::png.eq(data),
        ))
        .returning(club_image::id)
        .get_result(conn);
    if result.is_err() {
        print!("Diesel error {:?}\n", result.err());
        return None;
    }
    let club_image_id = result.unwrap();

    Some(serde_json::to_string(&json!({ "club_image_id": club_image_id })).unwrap())
}

// Add event image, return id
pub fn add_event_image_api(
    event_id: i64,
    data: Vec<u8>,
    conn: &mut PgConnection,
) -> Option<String> {
    let new_id_res: Result<Option<i64>, diesel::result::Error> = event_image::table
        .select(dsl::max(event_image::id))
        .get_result(conn);
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

    // Determine if an event with this id even exists
    let num_events_id: Result<i64, diesel::result::Error> = event::table
        .filter(event::id.eq(event_id))
        .count()
        .get_result(conn);
    if num_events_id.is_err() || num_events_id.unwrap() == 0 {
        return None;
    }

    // Get index
    let event_image_index_res: Result<i64, diesel::result::Error> = event_image::table
        .filter(event_image::event_id.eq(event_id))
        .count()
        .get_result(conn);
    if event_image_index_res.is_err() {
        return None;
    }
    let event_image_index = event_image_index_res.unwrap();

    let result: Result<i64, diesel::result::Error> = diesel::insert_into(event_image::table)
        .values((
            event_image::id.eq(new_id),
            event_image::event_id.eq(event_id),
            event_image::index.eq(event_image_index),
            event_image::png.eq(data),
        ))
        .returning(event_image::id)
        .get_result(conn);
    if result.is_err() {
        print!("Diesel error {:?}\n", result.err());
        return None;
    }
    let event_image_id = result.unwrap();

    Some(serde_json::to_string(&json!({ "event_image_id": event_image_id })).unwrap())
}

// Add club with data, return id
pub fn add_club_api(data: String, conn: &mut PgConnection) -> Option<String> {
    let club_struct_res: Result<PostClubJson, serde_json::Error> =
        serde_json::from_str(&data.as_str());
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
            club::description_text.eq(club_struct.description.clone()),
            club::description_html.eq(club_struct.description),
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

pub fn get_location_api(location_id: i64, conn: &mut PgConnection) -> Option<String> {
    let result: Result<Location, diesel::result::Error> = location::table
        .filter(location::id.eq(location_id))
        .get_result(conn);

    if result.is_err() {
        print!("Diesel error {:?}\n", result.err());
        return None;
    }
    let location = result.unwrap();

    Some(
        serde_json::to_string(&LocationJson {
            id: location.id,
            description: location.description,
        })
        .unwrap(),
    )
}

// Get location or create it if it does not exist
pub fn get_or_create_location_api(data: String, conn: &mut PgConnection) -> Option<String> {
    let location_struct_res: Result<LocationPostJson, serde_json::Error> =
        serde_json::from_str(&data.as_str());
    if location_struct_res.is_err() {
        print!("Serde error {:?}\n", location_struct_res.err());
        return None;
    }
    let location_struct = location_struct_res.unwrap();

    let location: Result<Location, diesel::result::Error> = location::table
        .filter(location::description.eq(location_struct.description.clone()))
        .get_result(conn);
    if location.is_err() {
        let location_err = location.err().unwrap();
        if location_err == diesel::NotFound {
            // Create the location
            let new_id_res: Result<Option<i64>, diesel::result::Error> = location::table
                .select(dsl::max(location::id))
                .get_result(conn);
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

            let result: Result<Location, diesel::result::Error> =
                diesel::insert_into(location::table)
                    .values((
                        location::id.eq(new_id),
                        location::description.eq(location_struct.description),
                    ))
                    .get_result(conn);

            if result.is_err() {
                print!("Diesel error {:?}\n", result.err());
                return None;
            }
            let location_res = result.unwrap();

            return Some(
                serde_json::to_string(&LocationJson {
                    id: location_res.id,
                    description: location_res.description,
                })
                .unwrap(),
            );
        } else {
            print!("Diesel error {:?}\n", location_err);
            return None;
        }
    }
    let location_res = location.unwrap();

    Some(
        serde_json::to_string(&LocationJson {
            id: location_res.id,
            description: location_res.description,
        })
        .unwrap(),
    )
}

// Clear all events
pub fn clear_events_api(conn: &mut PgConnection) -> Result<usize, diesel::result::Error> {
    let err: Result<usize, diesel::result::Error> = diesel::delete(event::table).execute(conn);
    if err.is_err() {
        return err;
    }
    let err: Result<usize, diesel::result::Error> =
        diesel::delete(event_image::table).execute(conn);
    if err.is_err() {
        return err;
    }
    let err: Result<usize, diesel::result::Error> =
        diesel::delete(event_category::table).execute(conn);
    if err.is_err() {
        return err;
    }
    diesel::delete(event_rsvp::table).execute(conn)
}

// Clear all clubs
pub fn clear_clubs_api(conn: &mut PgConnection) -> Result<usize, diesel::result::Error> {
    diesel::delete(club::table).execute(conn)
}
