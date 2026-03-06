# Step 1: Inventory Simulator (Java Beans)

**Extends**: `0-helloworld`

## What changed
We evolved from a simple hello world script to an object-oriented application. 
- Introduced `ItemBean.java` that follows standard Java Bean conventions (private fields, getters/setters, no-arg constructor).
- Introduced `InventorySimulator.java` to act as the program entry point, manually instantiating `ItemBean` objects and managing them in an in-memory `ArrayList`.

## How to verify
1. Open a terminal in this directory.
2. Compile both Java files:
   ```bash
   javac ItemBean.java InventorySimulator.java
   ```
3. Run the simulator:
   ```bash
   java InventorySimulator
   ```
4. You should see the simulated items printed to the console along with their total calculated value.

---

## 🐳 Running with Docker

```bash
docker compose up --build
```
