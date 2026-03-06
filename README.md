# Step 3.1: Modern React Frontend (Hybrid Architecture)

**Extends**: `3-inventory-frontend-vanilla`

## What changed
We have replaced our vanilla HTML/JS/CSS frontend with a modern React application built with Vite!

We have adopted a **Hybrid Sibling Architecture** where the project is split into two separate directories:
1. `backend/`: The Spring Boot Java API server.
2. `frontend/`: The Vite + React single-page application.

This elegant structure gives us the best of both worlds: you can run the UI and API completely decoupled for rapid interface development, or you can use Maven to automatically orchestrate them together into a single, production-ready monolithic `.jar` deployment!

---

## 🏃 Method 1: Decoupled Development Mode (Fast UI Iteration)

To run in development mode, you start both servers in two different terminal windows:

### 1. Start the Backend API
In your first terminal:
```bash
cd backend
./mvnw spring-boot:run
```
*(The backend API runs on `http://localhost:8080`)*

### 2. Start the Frontend App
In your second terminal:
```bash
cd frontend
npm install
npm run dev
```
*(The frontend runs on `http://localhost:5173`)*

Open your browser to `http://localhost:5173`. Vite is configured to automatically proxy `/api` requests to your running Spring Boot backend.

---

## 🚀 Method 2: Integrated Monolith Mode (Production Build)

To build and run the entire unified stack seamlessly as a monolith, Maven has been configured to reach into the `frontend` folder and orchestrate the Vite build:

```bash
cd backend
./mvnw clean spring-boot:run
```
*(Note: The first time you run this, it will take a little longer as Maven provisions Node.js locally and runs the Vite build behind the scenes.)*

Once started, open your browser to `http://localhost:8080`. You will see the beautiful React SPA loading natively from the unified Spring Boot server!

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

```bash
docker compose up --build
```
Open your browser to `http://localhost/`. Nginx proxies `/api` requests to the backend automatically.
