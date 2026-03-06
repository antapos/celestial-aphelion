# Step 3.1: Modern React Frontend (TDD)

**Extends**: `3-inventory-frontend` (conceptually)

## What changed
We evolved our static Vanilla JS frontend into a modern Single-Page Application (SPA) using React, Vite, and strict Test-Driven Development (TDD) principles!

- Initialized a React project using `create-vite`.
- Installed and configured `vitest` and `@testing-library/react`.
- Used the Red-Green-Refactor cycle to build `App.jsx`, `Auth.jsx`, and `InventoryGrid.jsx`.
- Reused our custom dark glassmorphism CSS to maintain the exact same premium visual aesthetic.
- Configured Vite's local proxy to forward `/api` requests to `http://localhost:8080` to seamlessly connect to our Spring Boot backend.

## How to verify
1. Start the Java Spring Boot API backend:
   ```bash
   cd 3.1-inventory-frontend-vite-react/backend # or 3-inventory-frontend-vanilla
   ./mvnw spring-boot:run
   ```
2. In a separate terminal, start the Vite development server:
   ```bash
   cd 3.1-inventory-frontend-vite-react/frontend
   npm run dev
   ```
3. Open your browser to the local Vite URL (typically `http://localhost:5173`).
4. You should see the same beautiful interface, powered by React!
5. To run the automated frontend tests:
   ```bash
   npm run test
   ```

## Next Steps
Now that we have a fully modern frontend, we will proceed to **Step 4: Advanced Java 25 Features** to refactor our backend.
