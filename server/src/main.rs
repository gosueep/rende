use actix_files as fs;
use actix_cors::Cors;
use actix_web::{middleware, App, HttpServer, HttpResponse, Responder, get, post, web, http};
use serde::{Serialize, Deserialize};

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
async fn login(info: web::Json<Login>) -> impl Responder {
	println!("Received login request: {:?}", info);
    let login = info.into_inner();
    let success = login.email == "Scott" && login.password == "Scott";
    let response = LoginResponse { success, user_id: 1 };
    HttpResponse::Ok().json(response)
}

#[get("/get_clubs")]
async fn get_clubs() -> impl Responder {
    let clubs = vec![
        Club { id: "1".to_string(), name: "Club 1".to_string(), meeting_time: "Monday 6pm".to_string(), description: "A club for testing purposes".to_string() },
        Club { id: "2".to_string(), name: "Club 2".to_string(), meeting_time: "Tuesday 7pm".to_string(), description: "Another club for testing purposes".to_string() },
        Club { id: "3".to_string(), name: "Club 3".to_string(), meeting_time: "Wednesday 8pm".to_string(), description: "A third club for testing purposes".to_string() },
    ];

    HttpResponse::Ok()
        .content_type("application/json")
        .body(serde_json::to_string(&clubs).unwrap())
}

#[get("/get_events")]
async fn get_events() -> impl Responder {
	HttpResponse::Ok()
	.content_type("application/json")
	.body("[{\"name\":\"test\"}]")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
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
					.max_age(3600)
            )
			.service(get_events)
			.service(get_clubs)
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
