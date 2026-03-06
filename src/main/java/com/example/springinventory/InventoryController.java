package com.example.springinventory;

import org.springframework.beans.factory.annotation.Autowired;
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
    public List<ItemBean> getAllItems() {
        return inventoryService.getAllItems();
    }

    // Example 2: GET a specific item (e.g., /api/inventory/ITM-001)
    @GetMapping("/{id}")
    public ItemBean getItem(@PathVariable String id) {
        Optional<ItemBean> item = inventoryService.getItemById(id);
        return item.orElse(null); // Spring automatically converts null to a 404 (in proper setups) or an empty
                                  // body
    }

    // Example 3: POST a new item (Spring automatically maps JSON to our ItemBean)
    @PostMapping
    public ItemBean addItem(@RequestBody ItemBean newItem) {
        inventoryService.addItem(newItem);
        return newItem;
    }

    // Example 4: A custom endpoint to get calculated values
    @GetMapping("/value")
    public Map<String, Object> getInventoryValue() {
        return Map.of(
                "totalItems", inventoryService.getAllItems().size(),
                "totalValue", inventoryService.calculateTotalValue());
    }
}
