package com.example.springinventory;

public sealed
interface PurchaseResult {
    record Success(ItemDTO item) implements PurchaseResult {}

    record NotFound(String id) implements PurchaseResult {}

    record OutOfStock(String id, int availableQuantity) implements PurchaseResult {}
}
