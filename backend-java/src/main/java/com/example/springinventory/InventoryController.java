package com.example.springinventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

// The @RestController annotation marks this class as a Web Endpoint.
// Under the hood, this is ALSO a Spring Bean managed by the framework!
@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    // This is "Dependency Injection" in action.
    // Spring sees we need an instance of InventoryService (which is a @Service
    // bean)
    // and automatically "injects" or provides the single instance it created.
    @Autowired
    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
        System.out.println("--> Spring is injecting InventoryService into InventoryController!");
    }

    // Example 1: GET all items
    @GetMapping
    public List<ItemDTO> getAllItems() {
        return inventoryService.getAllItems();
    }

    // Example 2: GET a specific item (e.g., /api/inventory/ITM-001)
    @GetMapping("/{id}")
    public ItemDTO getItem(@PathVariable String id) {
        Optional<ItemDTO> item = inventoryService.getItemById(id);
        return item.orElse(null); // Spring automatically converts null to a 404 (in proper setups) or an empty
                                  // body
    }

    // Example 3: POST a new item (Spring automatically maps JSON to our ItemBean)
    @PostMapping
    public ItemDTO addItem(@RequestBody ItemBean newItem) {
        inventoryService.addItem(newItem);
        return ItemDTO.fromEntity(newItem);
    }

    // Example 4: A custom endpoint to get calculated values
    @GetMapping("/value")
    public Map<String, Object> getInventoryValue() {
        return Map.of(
                "totalItems", inventoryService.getAllItems().size(),
                "totalValue", inventoryService.calculateTotalValue());
    }

    // Example 5: Purchase an item using Java 21+ Pattern Matching and Java 22+
    // Unnamed Variables
    @PostMapping("/{id}/purchase")
    public ResponseEntity<?> purchaseItem(@PathVariable String id, @RequestParam int quantity) {
        PurchaseResult result = inventoryService.purchaseItem(id, quantity);

        // Look at this absolutely beautiful modern Java switch expression!
        // No casting needed, and we return standard HTTP status codes instantly.
        return switch (result) {
            case PurchaseResult.Success(ItemDTO item) -> ResponseEntity.ok(item);
            case PurchaseResult.NotFound(String ignoredMsg) -> ResponseEntity.notFound().build();
            case PurchaseResult.OutOfStock(String ignoredMsg, int available) -> ResponseEntity.badRequest()
                    .body("Only " + available + " items left in stock!");
        };
    }
}
