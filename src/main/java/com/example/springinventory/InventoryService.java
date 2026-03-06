package com.example.springinventory;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

// This @Service annotation tells Spring that this class is a "Spring Bean".
// Spring will automatically create an instance of this and manage its lifecycle.
// This is also known as "Inversion of Control" (IoC).
@Service
public class InventoryService {

    private final List<ItemBean> inventoryList = new ArrayList<>();

    public InventoryService() {
        // Initialize with some default data
        System.out.println("--> Spring is creating the InventoryService Bean!");
        inventoryList.add(new ItemBean("ITM-001", "High-End Laptop", 10, 1500.00));
        inventoryList.add(new ItemBean("ITM-002", "Wireless Mouse", 50, 25.50));
    }

    public List<ItemBean> getAllItems() {
        return inventoryList;
    }

    public void addItem(ItemBean item) {
        inventoryList.add(item);
    }

    public Optional<ItemBean> getItemById(String id) {
        return inventoryList.stream()
                .filter(item -> item.getId().equals(id))
                .findFirst();
    }

    public double calculateTotalValue() {
        return inventoryList.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }
}
