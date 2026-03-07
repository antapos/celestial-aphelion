use axum::{
    extract::{Path, Query, State},
    http::{HeaderMap, StatusCode},
    response::{IntoResponse, Response},
    routing::{get, post},
    Json, Router,
};
use base64::{engine::general_purpose, Engine as _};
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Item {
    id: String,
    name: String,
    quantity: i32,
    price: f64,
}

type SharedState = Arc<Mutex<Vec<Item>>>;

#[derive(Deserialize)]
struct PurchaseQuery {
    quantity: i32,
}

#[tokio::main]
async fn main() {
    let inventory = vec![
        Item { id: "ITM-001".to_string(), name: "High-End Laptop".to_string(), quantity: 10, price: 1500.00 },
        Item { id: "ITM-002".to_string(), name: "Wireless Mouse".to_string(), quantity: 50, price: 25.50 },
        Item { id: "ITM-003".to_string(), name: "Mechanical Keyboard".to_string(), quantity: 25, price: 120.00 },
        Item { id: "ITM-004".to_string(), name: "27-inch Monitor".to_string(), quantity: 15, price: 350.00 },
        Item { id: "ITM-005".to_string(), name: "Noise-Cancelling Headphones".to_string(), quantity: 30, price: 200.00 },
        Item { id: "ITM-006".to_string(), name: "Ergonomic Chair".to_string(), quantity: 10, price: 450.00 },
        Item { id: "ITM-007".to_string(), name: "Webcam 4K".to_string(), quantity: 20, price: 150.00 },
        Item { id: "ITM-008".to_string(), name: "USB-C Docking Station".to_string(), quantity: 40, price: 180.00 },
        Item { id: "ITM-009".to_string(), name: "External SSD 1TB".to_string(), quantity: 35, price: 130.00 },
        Item { id: "ITM-010".to_string(), name: "Smart Speaker".to_string(), quantity: 60, price: 90.00 },
    ];

    let state = Arc::new(Mutex::new(inventory));

    let app = Router::new()
        .route("/api/inventory", get(get_inventory))
        .route("/api/inventory/{item_id}/purchase", post(purchase_item))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    println!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

async fn get_inventory(State(state): State<SharedState>) -> impl IntoResponse {
    let inventory = state.lock().unwrap();
    (StatusCode::OK, Json(inventory.clone()))
}

fn check_auth(headers: &HeaderMap) -> bool {
    if let Some(auth_val) = headers.get(axum::http::header::AUTHORIZATION) {
        if let Ok(auth_str) = auth_val.to_str() {
            if auth_str.starts_with("Basic ") {
                let encoded = &auth_str[6..];
                if let Ok(decoded) = general_purpose::STANDARD.decode(encoded) {
                    if let Ok(creds) = String::from_utf8(decoded) {
                        return creds == "admin:password";
                    }
                }
            }
        }
    }
    false
}

async fn purchase_item(
    State(state): State<SharedState>,
    headers: HeaderMap,
    Path(item_id): Path<String>,
    Query(query): Query<PurchaseQuery>,
) -> Response {
    if !check_auth(&headers) {
        let mut res = "Unauthorized".into_response();
        *res.status_mut() = StatusCode::UNAUTHORIZED;
        res.headers_mut().insert(
            axum::http::header::WWW_AUTHENTICATE,
            "Basic realm=\"Realm\"".parse().unwrap(),
        );
        return res;
    }

    let mut inventory = state.lock().unwrap();
    
    if let Some(item) = inventory.iter_mut().find(|i| i.id == item_id) {
        if item.quantity < query.quantity {
            (StatusCode::BAD_REQUEST, "Insufficient stock").into_response()
        } else {
            item.quantity -= query.quantity;
            (StatusCode::OK, "Purchase successful").into_response()
        }
    } else {
        (StatusCode::NOT_FOUND, "Item not found").into_response()
    }
}
