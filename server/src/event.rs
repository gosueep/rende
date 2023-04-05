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
use futures::{future::ok, stream::once};
use serde_json::{json};
use std::sync::{Mutex};


#[get("/get_event_image/{id}")]
async fn get_event_image(path: Path<i64>, db_conn: Data<Mutex<PgConnection>>) -> impl Responder {
    let image_id = path.into_inner();
    let image = database::get_event_image_api(image_id, &mut db_conn.into_inner().clone().lock().unwrap());

    // Return png bytes
    if image.is_some() {
        HttpResponse::Ok()
            .content_type("image/png")
            .streaming(once(ok::<_, Error>(Bytes::from(image.unwrap()))))
    } else {
        HttpResponse::InternalServerError()
            .content_type("application/json")
            .body(serde_json::to_string(&json!({ "error": "/get_event_image failed" })).unwrap())
    }
}

#[get("/get_event/{event_id}")]
async fn get_event(path: Path<i64>, db_conn: Data<Mutex<PgConnection>>) -> impl Responder {
    let event_id = path.into_inner();
    let event = database::get_event_api(event_id, &mut db_conn.into_inner().clone().lock().unwrap());

    // Return id, name, description and start
    if event.is_some() {
        HttpResponse::Ok()
            .content_type("application/json")
            .body(event.unwrap())
    } else {
        HttpResponse::InternalServerError()
            .content_type("application/json")
            .body(serde_json::to_string(&json!({ "error": "/get_event failed" })).unwrap())
    }
}

#[get("/get_newest_events/{num_events}")]
async fn get_newest_events(path: Path<i64>, db_conn: Data<Mutex<PgConnection>>) -> impl Responder {
    let num_events = path.into_inner();
    let events = database::get_newest_events_api(
        num_events,
        &mut db_conn.into_inner().clone().lock().unwrap(),
    );

    // Return id, name, description and start
    if events.is_some() {
        HttpResponse::Ok()
            .content_type("application/json")
            .body(events.unwrap())
    } else {
        HttpResponse::InternalServerError()
            .content_type("application/json")
            .body(serde_json::to_string(&json!({ "error": "/get_newest_events failed" })).unwrap())
    }
}

#[post("/post_event")]
async fn post_event(payload: String, db_conn: Data<Mutex<PgConnection>>) -> impl Responder {
    let event_id = database::add_event_api(payload, &mut db_conn.into_inner().clone().lock().unwrap());
    if event_id.is_some() {
        HttpResponse::Ok()
            .content_type("application/json")
            .body(event_id.unwrap())
    } else {
        HttpResponse::InternalServerError()
            .content_type("application/json")
            .body(serde_json::to_string(&json!({ "error": "/post_event failed" })).unwrap())
    }
}

#[post("/post_add_event_image")]
async fn post_add_event_image(
    payload: String,
    db_conn: Data<Mutex<PgConnection>>,
    request: HttpRequest,
) -> impl Responder {
    let req_headers = request.headers();
    let event_id_header = req_headers.get("Event-Id");
    let event_id_str: &str = event_id_header.unwrap().to_str().unwrap();

    let event_id = match event_id_str.parse::<i64>() {
        Ok(n) => n,
        Err(_) => {
            return HttpResponse::InternalServerError()
                .content_type("application/json")
                .body(
                    serde_json::to_string(
                        &json!({ "error": "/post_add_event_image failed, Event-Id is invalid" }),
                    )
                    .unwrap(),
                );
        }
    };

    let event_image_id = database::add_event_image_api(
        event_id,
        payload.as_bytes().to_vec(),
        &mut db_conn.into_inner().clone().lock().unwrap(),
    );
    if event_image_id.is_some() {
        HttpResponse::Ok()
            .content_type("application/json")
            .body(event_image_id.unwrap())
    } else {
        HttpResponse::InternalServerError()
            .content_type("application/json")
            .body(
                serde_json::to_string(&json!({ "error": "/post_add_event_image failed" })).unwrap(),
            )
    }
}
