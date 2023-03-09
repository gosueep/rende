use diesel::pg::PgConnection;
use diesel::prelude::*;
use std::env;

diesel::table! {
    clubs (id) {
        id -> Int4,
        name -> Varchar,
        description -> Text,
    }

	events (id) {
        id -> Int4,
        name -> Varchar,
        description -> Text,
    }
}

#[derive(Queryable)]
pub struct Club {
    pub id: i64,
    pub name: String,
    pub description: String,
}

#[derive(Queryable)]
pub struct Event {
    pub id: i64,
    pub name: String,
    pub description: String,
}

async fn start_database() -> PgConnection {
	let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}