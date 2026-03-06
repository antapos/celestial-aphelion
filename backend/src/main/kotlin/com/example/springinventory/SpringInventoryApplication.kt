package com.example.springinventory

import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean

@SpringBootApplication
class SpringInventoryApplication {

    @Bean
    fun init(repository: InventoryRepository) = CommandLineRunner {
        if (repository.count() == 0L) {
            repository.saveAll(listOf(
                Item("ITM-001", "High-End Laptop", 10, 1500.0),
                Item("ITM-002", "Wireless Mouse", 50, 25.50),
                Item("ITM-003", "Mechanical Keyboard", 25, 120.0),
                Item("ITM-004", "27-inch Monitor", 15, 350.0),
                Item("ITM-005", "Noise-Cancelling Headphones", 30, 200.0),
                Item("ITM-006", "Ergonomic Chair", 10, 450.0),
                Item("ITM-007", "Webcam 4K", 20, 150.0),
                Item("ITM-008", "USB-C Docking Station", 40, 180.0),
                Item("ITM-009", "External SSD 1TB", 35, 130.0),
                Item("ITM-010", "Smart Speaker", 60, 90.0)
            ))
            println("Database seeded with sample inventory.")
        }
    }
}

fun main(args: Array<String>) {
    runApplication<SpringInventoryApplication>(*args)
}
