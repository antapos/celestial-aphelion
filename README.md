# Step 2.3: Spring Security

**Extends**: `2.2-inventory-tdd`

## What changed
We added authentication and authorization to our API using Spring Security!
- Added `spring-boot-starter-security` to `pom.xml`.
- Created `SecurityConfig.java` to configure our security rules:
  - `GET` requests to `/api/inventory` are public.
  - All other requests (like `POST` to purchase or add items) require authentication.
  - Configured an in-memory user: `admin` with password `password`.
  - Disabled CSRF protection to make testing with `curl` easier.
- Updated `InventoryControllerTest.java`:
  - Used `@WithMockUser(username = "admin", roles = {"ADMIN"})` to simulate an authenticated user for tests that require it.
  - Added `purchaseItem_Unauthenticated_Returns401()` to explicitly test that unauthorized users format a `401 Unauthorized` response.

## How to verify
1. **Run the Automated Tests**: To prove that our security configurations are working and our tests are passing (including the new `401 Unauthorized` test), run the suite:
   ```bash
   ./mvnw test
   ```
2. **Start the server (for manual testing)**:
   ```bash
   ./mvnw spring-boot:run
   ```
2. **Public Endpoint (Works!)**: Try to get all items without credentials:
   ```bash
   curl -s http://localhost:8080/api/inventory
   ```
3. **Protected Endpoint (Fails!)**: Try to purchase an item without credentials. Notice the `401 Unauthorized` response:
   ```bash
   curl -i -X POST "http://localhost:8080/api/inventory/ITM-001/purchase?quantity=1"
   ```
4. **Protected Endpoint (Success!)**: Try to purchase an item *with* credentials using the `-u` flag for HTTP Basic Auth:
   ```bash
   curl -i -u admin:password -X POST "http://localhost:8080/api/inventory/ITM-001/purchase?quantity=1"
   ```

## Next Steps
Now that we have a fully functional backend with a database, TDD tests, and security, it's time to build a frontend to interact with it!
