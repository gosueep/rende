use crate::{
    database,
};

use actix_web::{
    get, post,
    web::{Bytes, Data, Path},
    Error, HttpRequest, HttpResponse, Responder,
};
use diesel::{
    pg::{PgConnection},
};
use serde_json::{json};
use std::sync::{Mutex};

#[get("/get_location/{location_id}")]
async fn get_location(path: Path<i64>, db_conn: Data<Mutex<PgConnection>>) -> impl Responder {
    let location_id = path.into_inner();
    let location = database::get_location_api(
        location_id,
        &mut db_conn.into_inner().clone().lock().unwrap(),
    );

    // Return id and description
    if location.is_some() {
        HttpResponse::Ok()
            .content_type("application/json")
            .body(location.unwrap())
    } else {
        HttpResponse::InternalServerError()
            .content_type("application/json")
            .body(serde_json::to_string(&json!({ "error": "/get_location failed" })).unwrap())
    }
}