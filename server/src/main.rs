mod database;

use actix_cors::Cors;
use actix_files as fs;
use actix_web::{get, http, middleware, post, web, App, HttpResponse, HttpServer, Responder};
use dotenvy::dotenv;
use serde::{Deserialize, Serialize};

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

#[derive(Serialize, Deserialize)]
struct Club {
    id: String,
    name: String,
    meeting_time: String,
    description: String,
}

#[post("/login")]
async fn login(info: web::Json<Login>, db_conn: web::Data<PgConnection>) -> impl Responder {
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
async fn get_clubs() -> impl Responder {
    let clubs = vec![
        Club {
            id: "1".to_string(),
            name: "Club 1".to_string(),
            meeting_time: "Monday 6pm".to_string(),
            description: "A club for testing purposes".to_string(),
        },
        Club {
            id: "2".to_string(),
            name: "Club 2".to_string(),
            meeting_time: "Tuesday 7pm".to_string(),
            description: "Another club for testing purposes".to_string(),
        },
        Club {
            id: "3".to_string(),
            name: "Club 3".to_string(),
            meeting_time: "Wednesday 8pm".to_string(),
            description: "A third club for testing purposes".to_string(),
        },
    ];

    //Return id, name, meeting_time, description, image url

    HttpResponse::Ok()
        .content_type("application/json")
        .body(serde_json::to_string(&clubs).unwrap())
}

#[get("/set_club_images")]
async fn get_club_images() -> impl Responder {
    //Allow admin to set image url for each club
}

#[get("/get_events")]
async fn get_events() -> impl Responder {
    HttpResponse::Ok()
        .content_type("application/json")
        .body("[{\"name\":\"test\"}]")
}

#[get("/get_event/{event_id}")]
async fn get_eventById(path: web::Path<(String)>) -> impl Responder {
    let event_id = path.into_inner();

    let event_info = vec![
        {id: "test-UFJKDJFSDF",
        name: "Test Event",
        datetime: new Date(Date.now()),
        location: "Marquez 123",
        description: "We meeting to plan stuff uhhh :)",
        attendees: ["Eugin", "NotEugin"],
        is_recurring: false}
    ];

    HttpResponse::Ok()
        .content_type("application/json")
        .body(serde_json::to_string(&event_info).unwrap())
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let db_conn = create_database().await;
    HttpServer::new(|| {
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
            .service(get_events)
            .service(get_clubs)
            .service(get_club_images)
            .app_data(web::Data::new(db_conn.clone()))
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
