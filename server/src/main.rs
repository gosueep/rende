mod database;
pub use crate::database::*;

use actix_cors::Cors;
use actix_files as fs;
use actix_web::{
    get, http, middleware, post, web,
    web::{Bytes, BytesMut, Data, Json, Path, Payload},
    App, Error, HttpRequest, HttpResponse, HttpServer, Responder,
};
use chrono::format::format;
use diesel::{
    pg::{Pg, PgConnection},
    IntoSql,
};
use dotenvy::dotenv;
use futures::{future::ok, stream::once};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::sync::{Arc, Mutex, RwLock};

#[derive(Debug, Serialize, Deserialize)]
struct Login {
    email: String,
    password_hash: String,
}

#[derive(Debug, Serialize)]
struct LoginResponse {
    success: bool,
    user_id: i32,
}

#[post("/login")]
async fn login(info: Json<Login>, db_conn: Data<Mutex<PgConnection>>) -> impl Responder {
    let login_response = login_user_api(
        &info.email.clone(),
        &info.password_hash.clone(),
        &mut db_conn.into_inner().clone().lock().unwrap(),
    );

    if login_response.is_some() {
        HttpResponse::Ok()
            .content_type("application/json")
            .body(login_response.unwrap())
    } else {
        HttpResponse::InternalServerError()
            .content_type("application/json")
            .body(serde_json::to_string(&json!({ "error": "/login failed" })).unwrap())
    }
}

#[get("/get_clubs")]
async fn get_clubs(db_conn: Data<Mutex<PgConnection>>) -> impl Responder {
    let clubs = get_all_clubs_api(&mut db_conn.into_inner().clone().lock().unwrap());

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
        get_club_by_organizer_api(user_id, &mut db_conn.into_inner().clone().lock().unwrap());

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
    let image = get_club_image_api(image_id, &mut db_conn.into_inner().clone().lock().unwrap());

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

#[get("/get_event_image/{id}")]
async fn get_event_image(path: Path<i64>, db_conn: Data<Mutex<PgConnection>>) -> impl Responder {
    let image_id = path.into_inner();
    let image = get_event_image_api(image_id, &mut db_conn.into_inner().clone().lock().unwrap());

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
    let event = get_event_api(event_id, &mut db_conn.into_inner().clone().lock().unwrap());

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
    let events = get_newest_events_api(
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
    let event_id = add_event_api(payload, &mut db_conn.into_inner().clone().lock().unwrap());
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

#[post("/post_club")]
async fn post_club(payload: String, db_conn: Data<Mutex<PgConnection>>) -> impl Responder {
    let club_id = add_club_api(payload, &mut db_conn.into_inner().clone().lock().unwrap());
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

    let club_image_id = add_club_image_api(
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

    let event_image_id = add_event_image_api(
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

#[get("/get_location/{location_id}")]
async fn get_location(path: Path<i64>, db_conn: Data<Mutex<PgConnection>>) -> impl Responder {
    let location_id = path.into_inner();
    let location = get_location_api(
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

#[post("/get_or_create_location")]
async fn get_or_create_location(
    payload: String,
    db_conn: Data<Mutex<PgConnection>>,
) -> impl Responder {
    let location =
        get_or_create_location_api(payload, &mut db_conn.into_inner().clone().lock().unwrap());
    if location.is_some() {
        HttpResponse::Ok()
            .content_type("application/json")
            .body(location.unwrap())
    } else {
        HttpResponse::InternalServerError()
            .content_type("application/json")
            .body(
                serde_json::to_string(&json!({ "error": "/get_or_create_location failed" }))
                    .unwrap(),
            )
    }
}

#[post("/clear_events")]
async fn clear_events(_payload: String, db_conn: Data<Mutex<PgConnection>>) -> impl Responder {
    let delete_res = clear_events_api(&mut db_conn.into_inner().clone().lock().unwrap());

    if delete_res.is_ok() {
        HttpResponse::Ok()
            .content_type("application/json")
            .body(serde_json::to_string(&json!({ "message": "/clear_events succeeded" })).unwrap())
    } else {
        HttpResponse::InternalServerError()
            .content_type("application/json")
            .body(serde_json::to_string(&json!({ "error": "/clear_events failed" })).unwrap())
    }
}

#[post("/clear_clubs")]
async fn clear_clubs(_payload: String, db_conn: Data<Mutex<PgConnection>>) -> impl Responder {
    let delete_res = clear_clubs_api(&mut db_conn.into_inner().clone().lock().unwrap());

    if delete_res.is_ok() {
        HttpResponse::Ok()
            .content_type("application/json")
            .body(serde_json::to_string(&json!({ "message": "/clear_clubs succeeded" })).unwrap())
    } else {
        HttpResponse::InternalServerError()
            .content_type("application/json")
            .body(serde_json::to_string(&json!({ "error": "/clear_clubs failed" })).unwrap())
    }
}

// All files with an extension
#[get("/{path:.*}.{ext}")]
async fn handle_with_extensions(req: HttpRequest) -> Result<fs::NamedFile, Error> {
    let file = fs::NamedFile::open(format!("../public{}", req.uri().path()))?;
    Ok(file)
}

// All files without an extension (handle clientside routing)
#[get("{path:.*}")]
async fn handle_without_extensions(req: HttpRequest) -> Result<fs::NamedFile, Error> {
    let file = fs::NamedFile::open("../public/index.html")?;
    Ok(file)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let db_conn = Data::new(Mutex::new(create_database()));
    HttpServer::new(move || {
        App::new()
            .wrap(middleware::Compress::default())
            .wrap(middleware::Logger::default())
            .wrap(
                Cors::permissive()
                    .allowed_origin("http://localhost:9000")
                    .allowed_origin("http://localhost:3030")
                    .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
                    .allowed_headers(vec![
                        http::header::AUTHORIZATION,
                        http::header::ACCEPT,
                        http::header::CONTENT_TYPE,
                    ])
                    .max_age(3600),
            )
            .app_data(Data::clone(&db_conn))
            .service(get_clubs)
            .service(get_club_by_organizer)
            .service(get_club_image)
            .service(get_event_image)
            .service(get_event)
            .service(get_newest_events)
            .service(post_event)
            .service(post_club)
            .service(clear_events)
            .service(clear_clubs)
            .service(post_add_club_image)
            .service(post_add_event_image)
            .service(get_or_create_location)
            .service(login)
            .service(handle_with_extensions)
            .service(handle_without_extensions)
        // .route("/login", web::get().to(login))
        // .service(
        //     web::resource("/user/{name}")
        //         .name("user_detail")
        //         .guard(guard::Header("content-type", "application/json"))
        //         .route(web::get().to(HttpResponse::Ok))
        //         .route(web::put().to(HttpResponse::Ok)),
        // )
        // .route("/", web::get().to(|| HttpResponse::Ok().body("/")))
        // .route("/")
    })
    .bind(("127.0.0.1", 3030))?
    .run()
    .await
}
