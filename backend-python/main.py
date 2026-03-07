from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.responses import JSONResponse
import base64

app = FastAPI()

# In-memory database matching the Java/Kotlin sample data
inventory = [
    {"id": "ITM-001", "name": "High-End Laptop", "quantity": 10, "price": 1500.0},
    {"id": "ITM-002", "name": "Wireless Mouse", "quantity": 50, "price": 25.50},
    {"id": "ITM-003", "name": "Mechanical Keyboard", "quantity": 25, "price": 120.0},
    {"id": "ITM-004", "name": "27-inch Monitor", "quantity": 15, "price": 350.0},
    {"id": "ITM-005", "name": "Noise-Cancelling Headphones", "quantity": 30, "price": 200.0},
    {"id": "ITM-006", "name": "Ergonomic Chair", "quantity": 10, "price": 450.0},
    {"id": "ITM-007", "name": "Webcam 4K", "quantity": 20, "price": 150.0},
    {"id": "ITM-008", "name": "USB-C Docking Station", "quantity": 40, "price": 180.0},
    {"id": "ITM-009", "name": "External SSD 1TB", "quantity": 35, "price": 130.0},
    {"id": "ITM-010", "name": "Smart Speaker", "quantity": 60, "price": 90.0}
]

def check_basic_auth(request: Request) -> bool:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Basic "):
        return False
    
    encoded_creds = auth_header.split(" ")[1]
    try:
        decoded_creds = base64.b64decode(encoded_creds).decode("utf-8")
        username, password = decoded_creds.split(":", 1)
        return username == "admin" and password == "password"
    except Exception:
        return False

@app.get("/api/inventory")
async def get_inventory():
    return inventory

@app.post("/api/inventory/{item_id}/purchase")
async def purchase_item(item_id: str, quantity: int, request: Request):
    if not check_basic_auth(request):
        # We need to mimic Spring Security's 401 response cleanly.
        # Actually returning a JSONResponse with 401 is generally sufficient.
        return Response(status_code=401, headers={"WWW-Authenticate": 'Basic realm="Realm"'})
    
    target_item = next((item for item in inventory if item["id"] == item_id), None)
    
    if target_item is None:
        return Response(content="Item not found", status_code=404)
    
    if target_item["quantity"] < quantity:
        return Response(content="Insufficient stock", status_code=400)
    
    target_item["quantity"] -= quantity
    return Response(content="Purchase successful", status_code=200)

