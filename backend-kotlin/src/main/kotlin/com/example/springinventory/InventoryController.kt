package com.example.springinventory

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/inventory")
class InventoryController(private val repository: InventoryRepository) {

    @GetMapping
    fun getAllItems(): List<Item> = repository.findAll()

    @PostMapping("/{id}/purchase")
    fun purchaseItem(@PathVariable id: String, @RequestParam quantity: Int): ResponseEntity<String> {
        val item = repository.findById(id).orElse(null) 
            ?: return ResponseEntity.status(404).body("Item not found")

        if (item.quantity < quantity) {
            return ResponseEntity.status(400).body("Insufficient stock")
        }

        item.quantity -= quantity
        repository.save(item)

        return ResponseEntity.ok("Purchase successful")
    }
}
