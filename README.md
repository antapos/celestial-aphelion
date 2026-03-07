# Step 4.0: Python FastAPI Backend Migration (Polyglot Era)

**Extends**: `3.3-inventory-frontend-solidjs`

## What changed
We have established a state-of-the-art "Black-Box Testing" safety net and successfully migrated our backend to **Python**:
1. **Testing Safety Net (`e2e-tests/`)**: Created a language-agnostic functional testing suite using `pytest` and `requests`. This proves that our new backend produces the exact same HTTP responses as our Kotlin baseline.
2. **Python Backend (`backend-python/`)**: Implemented a blazing fast replacement backend using **Python**, **FastAPI**, and **uvicorn**. This project is managed using `uv`, the modern lightning-fast Python package and project manager.
3. **Frontend**: Remains the exact same untouched **SolidJS** SPA, completely unaware that it is now talking to a Python server!

We are now running a Polyglot Architecture:
1. `backend/`: The legacy Spring Boot + Kotlin API server.
2. `backend-python/`: The bleeding-edge Python FastAPI server.
3. `frontend/`: The Vite + SolidJS UI.
4. `e2e-tests/`: The universal safety net.
5. `contracts/`: The OpenAPI Specification defining the exact API rules.

---

---

## 🏃 Method 1: The New Python Backend

You can run the new Python backend seamlessly. Since the API contracts match, the frontend won't know the difference!

### 1. Start the Python Backend API
In your first terminal, use `uv` to instantly resolve dependencies and run the server:
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

## 🏃 Method 2: The Legacy Kotlin Backend

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

To prove that both backends are functionally identical, start either backend locally on port `8080` as described above, and then run the test suite in another terminal:

```bash
cd e2e-tests
uv run pytest test_api.py -v
```
You should see all tests pass with flying colors, proving contract parity!

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

To run the frontend coupled to the **Python FastAPI** backend:
```bash
docker compose --profile python up --build
```

To run the frontend coupled to the **Kotlin Spring Boot** backend:
```bash
docker compose --profile java up --build
```
Open your browser to `http://localhost/`.
