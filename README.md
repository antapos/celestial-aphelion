# Step 5.0: The Tri-Glot Backend Architecture (Rust/Python/Kotlin)

**Extends**: `4.0-inventory-python-solidjs`

## What changed
We have added a third backend implementation: **Rust**, completing our Tri-Glot architecture!
1. **Rust Backend (`backend-rust/`)**: Implemented a type-safe, hyper-performant Rust backend utilizing `axum` and `tokio`. We used our E2E black-box safety net to prove it perfectly replicates our business logic.
2. **Testing Parity**: The SolidJS frontend and the E2E test suite interact with the Kotlin, Python, and Rust servers with absolutely zero changes required.
3. **OpenAPI Contract**: All backends adhere strictly to `contracts/openapi.yaml`.

We are now running a Tri-Glot Architecture:
1. `backend/`: The legacy Spring Boot + Kotlin API server.
2. `backend-python/`: The bleeding-edge Python FastAPI server.
3. `backend-rust/`: The hyper-performant Rust Axum server.
4. `frontend/`: The Vite + SolidJS UI.
5. `e2e-tests/`: The universal safety net.
6. `contracts/`: The OpenAPI Specification defining the exact API rules.

---

---

## 🏃 Method 1: The High-Performance Rust Backend

### 1. Start the Rust Backend API
In your first terminal, use `cargo` to run the Rust server:
```bash
cd backend-rust
cargo run
```
*(The backend API runs on `http://localhost:8080`)*

---

## 🏃 Method 2: The Fast Python Backend

You can also run the Python backend seamlessly. Since the API contracts match, the frontend won't know the difference!

### 1. Start the Python Backend API
In your first terminal:
```bash
cd backend-python
uv run uvicorn main:app --port 8080
```
*(The backend API runs on `http://localhost:8080`)*

### 2. Start the Frontend App
In your second terminal:
```bash
cd frontend
npm install
npm run dev
```
*(The frontend runs on `http://localhost:3000`)*

Open your browser to `http://localhost:5173`. Vite is configured to automatically proxy `/api` requests to port `8080`.

---

## 🏃 Method 2: The Parallel Mock Server (Frontend Only)

If the backend isn't ready, the frontend team can develop independently using our structured **OpenAPI Contract**.

### 1. Start the Prism Mock Server
In your first terminal:
```bash
cd frontend
npm run mock:api
```
*(Prism reads `contracts/openapi.yaml` and hosts a fake, responsive API on `http://localhost:8080`)*

### 2. Start the Frontend App
In your second terminal:
```bash
cd frontend
npm run dev
```

The frontend will work perfectly by talking to the mock server!

---

## 🏃 Method 4: The Legacy Kotlin Backend

If you prefer to run the Spring Boot Kotlin backend, you can!

### 1. Start the Kotlin Backend API
Ensure you are using Java 21:
```bash
cd backend
sdk env        # Switch to Java 21 as defined in .sdkmanrc
./mvnw spring-boot:run
```

You can then run the `frontend` exactly the same way as Method 1. Or, you can build them together:
```bash
cd backend
./mvnw clean spring-boot:run
```
Once started, open your browser to `http://localhost:8080`.

---

## 🛡️ Running the Safety Net (E2E Tests)

To prove that all backends are functionally identical, start any backend locally on port `8080`, and then run the test suite in another terminal:

```bash
cd e2e-tests
uv run pytest test_api.py -v
```
You should see all tests pass with flying colors, proving contract parity!

---

## 🏎️ Performance Benchmarks
We ran an identical `10-second` load test (`100` concurrent connections) against each implementation.

| Backend Implementation | Memory at Rest | Requests per Second (RPS) | Avg Latency | P99 Latency |
| :--- | :--- | :--- | :--- | :--- |
| **Kotlin (Spring Boot)** | `~239 MB` | `4,366 req/s` | `22.91 ms` | `98.89 ms` |
| **Python (FastAPI)** | `~38 MB` | `1,641 req/s` | `61.05 ms` | `94.85 ms` |
| **Rust (Axum)** | `~1.6 MB` | `53,365 req/s` | `1.86 ms` | `17.45 ms` |

*The Rust backend achieves **12x more throughput** than Kotlin, while using **140x less memory**!*

---

## How to Navigate This Repository (The Time Machine)

Instead of keeping copies of the application in separate folders, we use **Git Tags** to perfectly preserve the history at the root of the project. This means you can instantly transport the entire repository back in time to any specific step.

### Step 1: See all available steps
Run the following command in your terminal to list all the evolutionary steps:
```bash
git tag
```
*Output:*
```text
v0-helloworld
v1-inventory-simulator
v2-inventory-spring
v2.1-inventory-spring-data
v2.2-inventory-tdd
v2.3-inventory-spring-security
v2.4-advanced-java
v3-inventory-frontend-vanilla
v3.1-inventory-frontend-vite-react
v3.2-inventory-frontend-vue
v3.3-inventory-frontend-solidjs
v4-inventory-python-solidjs
v5-inventory-rust-solidjs
```

### Step 2: Travel back in time
Choose the step you want to examine and checkout that exact tag. For example, to see how the project looked during Step 2:
```bash
git checkout v2-inventory-spring
```
*The files in your folder will instantly change to reflect that exact moment in history!*

### Step 2.5: Avoid leftover files (important!)
When switching between tags, **untracked files** (files not committed in any snapshot) are left behind by Git — they won't be removed automatically. After each checkout, run:
```bash
# Preview what would be removed (safe dry run)
git clean -nd

# Remove untracked files and directories
git clean -fd
```

> **Tip:** Always run `git clean -nd` first to preview before the destructive `-fd`. If you also want to remove build artifacts and files listed in `.gitignore`, add `-x`: `git clean -fdx`

### Step 3: Return to the present
When you are done exploring history and want to return to the latest, most modern version of the code, simply run:
```bash
git checkout main
```

---

## 🐳 Running with Docker

To run the frontend coupled to the **Rust Axum** backend:
```bash
docker compose --profile rust up --build
```

To run the frontend coupled to the **Python FastAPI** backend:
```bash
docker compose --profile python up --build
```

To run the frontend coupled to the **Kotlin Spring Boot** backend:
```bash
docker compose --profile java up --build
```
Open your browser to `http://localhost/`.
