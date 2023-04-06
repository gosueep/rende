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


#[get("/get_clubs")]
async fn get_clubs(db_conn: Data<Mutex<PgConnection>>) -> impl Responder {
    let clubs = database::get_all_clubs_api(&mut db_conn.into_inner().clone().lock().unwrap());

    // Return id, name, description and start
    if clubs.is_some() {
        HttpResponse::Ok()
            .content_type("application/json")
            .body(clubs.unwrap())
    } else {
        HttpResponse::InternalServerError()
            .content_type("application/json")
            .body(serde_json::to_string(&json!({ "error": "/get_clubs failed" })).unwrap())
    }
}

//Get club organizer by user id
#[get("/get_club_by_organizer/{user_id}")]
async fn get_club_by_organizer(
    path: Path<i64>,
    db_conn: Data<Mutex<PgConnection>>,
) -> impl Responder {
    let user_id = path.into_inner();
    let clubs =
        database::get_club_by_organizer_api(user_id, &mut db_conn.into_inner().clone().lock().unwrap());

    // Return id, name, description and start
    if clubs.is_some() {
        HttpResponse::Ok()
            .content_type("application/json")
            .body(clubs.unwrap())
    } else {
        HttpResponse::InternalServerError()
            .content_type("application/json")
            .body(
                serde_json::to_string(&json!({ "error": "/get_club_by_organizer failed" }))
                    .unwrap(),
            )
    }
}

#[get("/get_club_image/{id}")]
async fn get_club_image(path: Path<i64>, db_conn: Data<Mutex<PgConnection>>) -> impl Responder {
    let image_id = path.into_inner();
    let image = database::get_club_image_api(image_id, &mut db_conn.into_inner().clone().lock().unwrap());

    // Return png bytes
    if image.is_some() {
        HttpResponse::Ok()
            .content_type("image/png")
            .streaming(once(ok::<_, Error>(Bytes::from(image.unwrap()))))
    } else {
        HttpResponse::InternalServerError()
            .content_type("application/json")
            .body(serde_json::to_string(&json!({ "error": "/get_club_image failed" })).unwrap())
    }
}


#[post("/post_club")]
async fn post_club(payload: String, db_conn: Data<Mutex<PgConnection>>) -> impl Responder {
    let club_id = database::add_club_api(payload, &mut db_conn.into_inner().clone().lock().unwrap());
    if club_id.is_some() {
        HttpResponse::Ok()
            .content_type("application/json")
            .body(club_id.unwrap())
    } else {
        HttpResponse::InternalServerError()
            .content_type("application/json")
            .body(serde_json::to_string(&json!({ "error": "/post_club failed" })).unwrap())
    }
}

#[post("/post_add_club_image")]
async fn post_add_club_image(
    payload: String,
    db_conn: Data<Mutex<PgConnection>>,
    request: HttpRequest,
) -> impl Responder {
    let req_headers = request.headers();
    let club_id_header = req_headers.get("Club-Id");
    let club_id_str: &str = club_id_header.unwrap().to_str().unwrap();

    let club_id = match club_id_str.parse::<i64>() {
        Ok(n) => n,
        Err(_) => {
            return HttpResponse::InternalServerError()
                .content_type("application/json")
                .body(
                    serde_json::to_string(
                        &json!({ "error": "/post_add_club_image failed, Event-Id is invalid" }),
                    )
                    .unwrap(),
                );
        }
    };

    let club_image_id = database::add_club_image_api(
        club_id,
        payload.as_bytes().to_vec(),
        &mut db_conn.into_inner().clone().lock().unwrap(),
    );
    if club_image_id.is_some() {
        HttpResponse::Ok()
            .content_type("application/json")
            .body(club_image_id.unwrap())
    } else {
        HttpResponse::InternalServerError()
            .content_type("application/json")
            .body(
                serde_json::to_string(&json!({ "error": "/post_add_club_image failed" })).unwrap(),
            )
    }
}
