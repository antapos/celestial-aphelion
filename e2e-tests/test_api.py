import requests
import pytest
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:8080/api/inventory"
AUTH = HTTPBasicAuth('admin', 'password')
INVALID_AUTH = HTTPBasicAuth('admin', 'wrongpath')

def test_get_inventory():
    response = requests.get(BASE_URL)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    # Verify the structure roughly matching the original Spring/Kotlin `Item` logic
    item = data[0]
    assert "id" in item
    assert "name" in item
    assert "quantity" in item
    assert "price" in item

def test_purchase_item_success():
    # Fetch an item first to know its ID and current quantity
    get_res = requests.get(BASE_URL)
    data = get_res.json()
    target_item = next(item for item in data if item["quantity"] >= 2)
    item_id = target_item["id"]
    initial_qty = target_item["quantity"]

    # Purchase 2 units
    post_res = requests.post(
        f"{BASE_URL}/{item_id}/purchase", 
        params={"quantity": 2}, 
        auth=AUTH
    )
    assert post_res.status_code == 200
    assert "Purchase successful" in post_res.text

    # Verify the quantity decreased by 2
    verify_res = requests.get(BASE_URL)
    new_data = verify_res.json()
    updated_item = next(item for item in new_data if item["id"] == item_id)
    assert updated_item["quantity"] == initial_qty - 2

def test_purchase_item_insufficient_stock():
    # Attempt to purchase an impossibly large quantity
    get_res = requests.get(BASE_URL)
    item_id = get_res.json()[0]["id"]
    curr_qty = get_res.json()[0]["quantity"]

    post_res = requests.post(
        f"{BASE_URL}/{item_id}/purchase", 
        params={"quantity": curr_qty + 10}, 
        auth=AUTH
    )
    assert post_res.status_code == 400
    assert "Insufficient stock" in post_res.text

def test_purchase_item_not_found():
    post_res = requests.post(
        f"{BASE_URL}/ITM-NONEXISTENT/purchase", 
        params={"quantity": 1}, 
        auth=AUTH
    )
    assert post_res.status_code == 404
    assert "Item not found" in post_res.text

def test_purchase_item_unauthorized():
    get_res = requests.get(BASE_URL)
    item_id = get_res.json()[0]["id"]

    # No auth
    post_res = requests.post(
        f"{BASE_URL}/{item_id}/purchase", 
        params={"quantity": 1}
    )
    assert post_res.status_code == 401

    # Invalid auth
    post_res_invalid = requests.post(
        f"{BASE_URL}/{item_id}/purchase", 
        params={"quantity": 1},
        auth=INVALID_AUTH
    )
    assert post_res_invalid.status_code == 401
