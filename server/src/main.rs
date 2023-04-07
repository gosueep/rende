mod database;
mod event;
mod club;
mod location;
pub use crate::database::*;

// JWT STUFF
// mod config;
// mod handler;
// mod jwt_auth;
// mod model;
// mod response;
// use config::Config;
// JWT

use actix_cors::Cors;
use actix_files as fs;
use actix_web::{
    get, http, middleware, post, 
    web::{Data, Json, Path},
    App, Error, HttpRequest, HttpResponse, HttpServer, Responder,
};
// use chrono::format::format;
use diesel::{
    pg::{PgConnection},
};
use dotenvy::dotenv;
// use futures::{future::ok, stream::once};
use serde::{Deserialize, Serialize};
use serde_json::{json};
use std::sync::{Mutex};
use sqlx::{postgres::PgPoolOptions, Pool, Postgres};


// pub struct AppState {
//     db: Pool<Postgres>,
//     env: Config,
// }

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

// I don't think we should allow these through an API
// #[post("/clear_events")]
// async fn clear_events(_payload: String, db_conn: Data<Mutex<PgConnection>>) -> impl Responder {
//     let delete_res = clear_events_api(&mut db_conn.into_inner().clone().lock().unwrap());

//     if delete_res.is_ok() {
//         HttpResponse::Ok()
//             .content_type("application/json")
//             .body(serde_json::to_string(&json!({ "message": "/clear_events succeeded" })).unwrap())
//     } else {
//         HttpResponse::InternalServerError()
//             .content_type("application/json")
//             .body(serde_json::to_string(&json!({ "error": "/clear_events failed" })).unwrap())
//     }
// }

// #[post("/clear_clubs")]
// async fn clear_clubs(_payload: String, db_conn: Data<Mutex<PgConnection>>) -> impl Responder {
//     let delete_res = clear_clubs_api(&mut db_conn.into_inner().clone().lock().unwrap());

//     if delete_res.is_ok() {
//         HttpResponse::Ok()
//             .content_type("application/json")
//             .body(serde_json::to_string(&json!({ "message": "/clear_clubs succeeded" })).unwrap())
//     } else {
//         HttpResponse::InternalServerError()
//             .content_type("application/json")
//             .body(serde_json::to_string(&json!({ "error": "/clear_clubs failed" })).unwrap())
//     }
// }

// All files with an extension
#[get("/{path:.*}.{ext}")]
async fn handle_with_extensions(req: HttpRequest) -> Result<fs::NamedFile, Error> {
    let file = fs::NamedFile::open(format!("../public{}", req.uri().path()))?;
    Ok(file)
}

// All files without an extension (handle clientside routing)
#[get("/{path:.*}")]
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
            .service(club::get_clubs)
            .service(club::get_club_by_organizer)
            .service(club::get_club_image)
            .service(event::get_event_image)
            .service(event::get_event)
            .service(event::get_newest_events)
            .service(event::post_event)
            .service(club::post_club)
            // .service(clear_events)
            // .service(clear_clubs)
            .service(club::post_add_club_image)
            .service(event::post_add_event_image)
            .service(get_or_create_location)
            .service(location::get_location)
            .service(login)
            .service(handle_with_extensions)
            .service(handle_without_extensions)
            // .configure(handler::config)
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
