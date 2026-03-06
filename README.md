# Step 2: Inventory Spring Boot

**Extends**: `1-inventory-simulator`

## What changed
We transitioned from a manual Java console application to a modern web service using the Spring Boot framework (v3.5.0) and Spring Beans.
- Migrated `ItemBean` into the Spring Project structure.
- Replaced `InventorySimulator` with `InventoryService` (a Spring Bean managed via `@Service`) to handle business logic and in-memory storage.
- Added `InventoryController` (a `@RestController`) to expose the inventory data over HTTP. 

## How to verify
1. Open a terminal in this directory.
2. Start the Spring Boot server using the Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```
3. In a separate terminal (or browser), verify the REST endpoints:
   - Get all items:
     ```bash
     curl http://localhost:8080/api/inventory
     ```
   - Get inventory value:
     ```bash
     curl http://localhost:8080/api/inventory/value
     ```
4. Press `Ctrl+C` in the terminal running Spring Boot to stop the server.
