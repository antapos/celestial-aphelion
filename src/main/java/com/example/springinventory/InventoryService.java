package com.example.springinventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {

    // We now inject our Spring Data JPA Repository!
    // We no longer need the hardcoded `List<ItemBean>`.
    private final ItemRepository itemRepository;

    @Autowired
    public InventoryService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
        System.out.println("--> Spring is injecting ItemRepository into InventoryService!");

        // Let's seed the database on startup if it's empty
        if (this.itemRepository.count() == 0) {
            System.out.println("--> Seeding H2 database with initial items...");
            this.itemRepository.save(new ItemBean("ITM-001", "High-End Laptop", 10, 1500.00));
            this.itemRepository.save(new ItemBean("ITM-002", "Wireless Mouse", 50, 25.50));
        }
    }

    public List<ItemDTO> getAllItems() {
        // JPA handles the SQL SELECT query automatically, then we map each to a Record
        return itemRepository.findAll().stream()
                .map(ItemDTO::fromEntity)
                .toList(); // Stream.toList() is the modern Java way to collect streams!
    }

    public void addItem(ItemBean item) {
        // JPA handles the SQL INSERT/UPDATE query automatically
        itemRepository.save(item);
    }

    public Optional<ItemDTO> getItemById(String id) {
        // JPA handles the SQL SELECT ... WHERE id=? query
        return itemRepository.findById(id).map(ItemDTO::fromEntity);
    }

    public double calculateTotalValue() {
        // We still calculate this in Java for now,
        // though we could theoretically write a custom JPA query for this too!
        return itemRepository.findAll().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }

    public PurchaseResult purchaseItem(String id, int quantityToBuy) {
        // We use Optional mapping to handle the NotFound case elegantly
        return itemRepository.findById(id).map(item -> {
            try {
                item.removeStock(quantityToBuy);
                itemRepository.save(item);
                return new PurchaseResult.Success(ItemDTO.fromEntity(item));
            } catch (InsufficientStockException e) {
                return new PurchaseResult.OutOfStock(item.getId(), item.getQuantity());
            }
        }).orElseGet(() -> new PurchaseResult.NotFound(id));
    }
}
