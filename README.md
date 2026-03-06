# Step 2.2: Test-Driven Development (TDD)

**Extends**: `2.1-inventory-spring-data`

## What changed
We introduced a strict Test-Driven Development (TDD) workflow, writing failing tests *before* writing any business logic.
- Added `InventoryServiceTest.java` (Unit Tests) using **JUnit 5** and **Mockito** to mock our database layer.
- Added `InventoryControllerTest.java` (Integration Tests) using Spring's `@WebMvcTest` and `MockMvc` to send simulated HTTP requests without spinning up a real web server.
- Following the "Red-Green-Refactor" cycle, we implemented a new `purchaseItem` feature that deducts stock and throws a custom `InsufficientStockException` (HTTP 400 Bad Request) if a user tries to buy more than is available.

## How to verify
You no longer need to manually start the server and run `curl` commands to make sure the app works. You rely on the automated test suite!

1. Open a terminal in this directory.
2. Run the test suite using the Maven wrapper:
   ```bash
   ./mvnw test
   ```
3. You should see `BUILD SUCCESS` with output indicating `Tests run: 6, Failures: 0, Errors: 0, Skipped: 0`.

## How to test more of the app
If you want to practice TDD yourself, try adding tests for existing functionality!
1. Open `src/test/java/com/example/springinventory/InventoryControllerTest.java`.
2. Add a new method annotated with `@Test`.
3. Use `mockMvc.perform(get("/api/inventory/INVALID_ID")).andExpect(status().isNotFound());`.
4. Run the tests. They will fail (because currently, missing items return 200 OK with an empty body).
5. Go to `InventoryController.java` and fix the logic to make the test pass!

---

## 🐳 Running with Docker

```bash
docker compose up --build
```
Open your browser to `http://localhost:8080`.
