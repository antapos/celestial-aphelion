# Step 5.1: The Tri-Glot Backend Architecture & Benchmarks

**Extends**: `4.0-inventory-python-solidjs`

## What changed
We have expanded our Polyglot architecture to include **Rust** and revived the legacy **Java** implementation for benchmarking comparisons!
1. **Rust Backend (`backend-rust/`)**: Implemented a type-safe, hyper-performant Rust backend utilizing `axum` and `tokio`. We used our E2E black-box safety net to prove it perfectly replicates our business logic.
2. **Legacy Java Backend (`backend-java/`)**: We extracted the exact standard Java codebase from `v2.4-advanced-java`.
3. **OpenAPI Contract**: All backends (Kotlin, Java, Python, Rust) adhere strictly to `contracts/openapi.yaml`.

We are now running a Tri-Glot Architecture:
1. `backend-kotlin/`: The modern Spring Boot + Kotlin API server.
2. `backend-java/`: The legacy pure Java API server.
3. `backend-python/`: The bleeding-edge Python FastAPI server.
4. `backend-rust/`: The hyper-performant Rust Axum server.
5. `frontend/`: The Vite + SolidJS UI.
6. `e2e-tests/`: The universal safety net.
7. `contracts/`: The OpenAPI Specification defining the exact API rules.

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

If you prefer to run the modern Spring Boot Kotlin backend, you can!

### 1. Start the Kotlin Backend API
Ensure you are using Java 21:
```bash
cd backend-kotlin
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

| Backend Implementation | Files | Lines of Code | Memory at Rest | Requests per Second (RPS) | P99 Latency |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Rust (Axum)** | `1` | `103` | `~1.6 MB` | `63,259 req/s` | `11.27 ms` |
| **Python (FastAPI)** | `1` | `55` | `~100 MB` | `7,180 req/s` | `28.93 ms` |
| **Kotlin (Spring Boot)** | `5` | `126` | `~371 MB` | `3,105 req/s` | `142.76 ms` |
| **Java 21 (Spring Boot)** | `9` | `320` | `~354 MB` | `3,069 req/s` | `115.23 ms` |
| **Java 25 (Spring Boot)** | `9` | `320` | `~313 MB` | `2,993 req/s` | `163.77 ms` |

* **Performance King**: The Rust backend handles **63k+ requests per second** using just **1.6 MB of RAM**—an absolute masterclass in bare-metal efficiency.
* **The "Python Beats Java" Shock (Readability King)**: We configured Python to spawn 4 workers under `uvloop`. Not only is Python the most readable implementation (**1 file, 55 lines** vs Java's 9 files, 320 lines), but it actually **beat the JVM** on raw throughput (7.1k vs 3.1k RPS) in this scenario!
* **Java Virtual Threads Overhead**: We enabled `spring.threads.virtual.enabled=true`. While Virtual Threads are legendary for blocking I/O, they introduced context-switching overhead in this purely CPU/Memory-bound JSON serialization test, lowering Java's RPS from its earlier peak of 5.8k down to 3.1k. The right tool for the right job!

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
