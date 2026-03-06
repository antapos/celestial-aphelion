# Step 3: Frontend Web Interface

**Extends**: `2.3-inventory-spring-security`

## What changed
We have transformed our backend API into a full-stack application by adding a stunning, static frontend served directly by Spring Boot!
- Created `src/main/resources/static/index.html` to hold the main layout and dashboard.
- Created `src/main/resources/static/index.css` implementing a "dark glassmorphism" design system.
- Created `src/main/resources/static/app.js` to bridge the styling with the Spring Boot API:
  - Fetches and displays data using the public `GET /api/inventory` endpoint.
  - Handles authentication state using Base64 encoded Basic Auth credentials.
  - Submits purchases securely via the `POST /api/inventory/{id}/purchase` endpoint with those credentials.

## How to verify
1. Start the application:
   ```bash
   ./mvnw spring-boot:run
   ```
2. Open your web browser and navigate to `http://localhost:8080/`.
3. Try purchasing an item (it should throw an "Access Denied" toast).
4. Enter the credentials `admin` and `password` in the top right to log in.
5. Watch the dashboard update dynamically as you buy out the inventory stock!

## Next Steps
Now that we have a beautiful app, we will explore **Advanced Java 25 Features** in the next evolution to refactor our codebase to be as modern as possible!
