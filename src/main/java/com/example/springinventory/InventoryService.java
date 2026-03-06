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

    public List<ItemBean> getAllItems() {
        // JPA handles the SQL SELECT query automatically
        return itemRepository.findAll();
    }

    public void addItem(ItemBean item) {
        // JPA handles the SQL INSERT/UPDATE query automatically
        itemRepository.save(item);
    }

    public Optional<ItemBean> getItemById(String id) {
        // JPA handles the SQL SELECT ... WHERE id=? query
        return itemRepository.findById(id);
    }

    public double calculateTotalValue() {
        // We still calculate this in Java for now,
        // though we could theoretically write a custom JPA query for this too!
        return itemRepository.findAll().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }

    public void purchaseItem(String id, int quantityToBuy) {
        // Find the item, or throw exception if it doesn't exist
        ItemBean item = itemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Item not found: " + id));

        // Use our domain logic to remove stock (throws exception if not enough)
        item.removeStock(quantityToBuy);

        // Save the updated entity back to the database
        itemRepository.save(item);
    }
}
