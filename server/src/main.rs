use actix_files as fs;
use actix_web::{middleware, App, HttpServer, HttpResponse, Responder, get};

#[get("/get_events")]
async fn get_events() -> impl Responder {
	HttpResponse::Ok()
	.content_type("application/json")
	.append_header(("Access-Control-Allow-Origin", "127.0.0.1"))
	.body("[{\"name\":\"test\"}]")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
	HttpServer::new(|| {
		App::new()
			.wrap(middleware::Compress::default())
			.service(get_events)
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
