mod database;
pub use crate::database::*;

use actix_cors::Cors;
use actix_files as fs;
use actix_web::{
    get, http, middleware, post,
    web::{Bytes, Data, Json, Path},
    App, Error, HttpResponse, HttpServer, Responder,
};
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
    password: String,
}

#[derive(Debug, Serialize)]
struct LoginResponse {
    success: bool,
    user_id: i32,
}

#[post("/login")]
async fn login(info: Json<Login>, db_conn: Data<Mutex<PgConnection>>) -> impl Responder {
    println!("Received login request: {:?}", info);
    let login = info.into_inner();

    //Check email and password against database, return user_id if successful

    let response = LoginResponse {
        success: true,
        user_id: 1,
    };
    HttpResponse::Ok().json(response)
}

#[get("/get_clubs")]
async fn get_clubs(db_conn: Data<Mutex<PgConnection>>) -> impl Responder {
    let clubs = get_all_clubs_json(&mut db_conn.into_inner().clone().lock().unwrap());

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

#[get("/club_image/{id}")]
async fn get_club_images(path: Path<(i64)>, db_conn: Data<Mutex<PgConnection>>) -> impl Responder {
    let image_id = path.into_inner();
    let image = get_club_image(image_id, &mut db_conn.into_inner().clone().lock().unwrap());

    // Return png bytes
    if image.is_some() {
        HttpResponse::Ok()
            .content_type("image/png")
            .streaming(once(ok::<_, Error>(Bytes::from(image.unwrap()))))
    } else {
        HttpResponse::InternalServerError()
            .content_type("application/json")
            .body(serde_json::to_string(&json!({ "error": "/get_clubs failed" })).unwrap())
    }
}

#[get("/get_events")]
async fn get_events(db_conn: Data<Mutex<PgConnection>>) -> impl Responder {
    let events = get_all_events_json(&mut db_conn.into_inner().clone().lock().unwrap());

    // Return id, name, description and start
    if events.is_some() {
        HttpResponse::Ok()
            .content_type("application/json")
            .body(events.unwrap())
    } else {
        HttpResponse::InternalServerError()
            .content_type("application/json")
            .body(serde_json::to_string(&json!({ "error": "/get_events failed" })).unwrap())
    }
}

#[get("/get_event/{event_id}")]
async fn get_event(path: Path<(i64)>, db_conn: Data<Mutex<PgConnection>>) -> impl Responder {
    let event_id = path.into_inner();
    let event = get_event_json(event_id, &mut db_conn.into_inner().clone().lock().unwrap());

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
                    .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
                    .allowed_headers(vec![
                        http::header::AUTHORIZATION,
                        http::header::ACCEPT,
                        http::header::CONTENT_TYPE,
                    ])
                    .max_age(3600),
            )
            .app_data(Data::clone(&db_conn))
            .service(get_events)
            .service(get_clubs)
            .service(get_club_images)
            .service(get_event)
            .service(login)
            //.service(web::resource("/").to(|req: HttpRequest| async move {
            //	fs::NamedFile::open_async("../public/index.html").await.unwrap().into_response(&req)
            //}))
            .service(
                fs::Files::new("/", "../public")
                    .index_file("index.html")
                    .show_files_listing(),
            )
    })
    .bind(("127.0.0.1", 3030))?
    .run()
    .await
}