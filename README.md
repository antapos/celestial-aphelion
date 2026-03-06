# Step 2.1: Inventory Spring Data JPA

**Extends**: `2-inventory-spring`

## What changed
We replaced our list-based in-memory storage with a real embedded database (H2) and automated data access using Spring Data JPA.
- Updated `pom.xml` to include `spring-boot-starter-data-jpa` and the `h2` database driver.
- Configured `application.properties` to connect to the in-memory H2 database.
- Converted `ItemBean` into a JPA `@Entity` mapped to an `items` table.
- Created `ItemRepository` extending `JpaRepository` to automatically handle database CRUD operations without writing SQL.
- Updated `InventoryService` to query the database via the repository instead of maintaining a local list.

## How to verify
1. Open a terminal in this directory.
2. Start the Spring Boot server using the Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```
3. Verify that the database successfully seeded the items:
   ```bash
   curl http://localhost:8080/api/inventory
   ```
4. Verify you can insert a new item and that the total value recalculates correctly by issuing a POST request:
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{"id":"ITM-003","name":"Mechanical Keyboard","quantity":15,"price":120.00}' http://localhost:8080/api/inventory
   ```
   ```bash
   curl http://localhost:8080/api/inventory/value
   ```
5. Press `Ctrl+C` in the terminal running Spring Boot to stop the server.
