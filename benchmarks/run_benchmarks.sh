#!/usr/bin/env bash

# Ensures script stops on error
set -e

PORT=8080
URL="http://127.0.0.1:${PORT}/api/inventory"
CONCURRENCY=100
DURATION="10s"

# Function to run benchmark given a name, directory, and start command
run_benchmark() {
    local name=$1
    local dir=$2
    local cmd=$3

    echo "================================================="
    echo "Starting Benchmark for: $name"
    echo "================================================="

    # 1. Ensure port is free
    kill $(lsof -t -i:$PORT) 2>/dev/null || true
    sleep 2

    # 2. Start the server in the background
    echo "Starting server via: $cmd in $dir"
    cd "$dir"
    eval "$cmd > /dev/null 2>&1 &"
    SERVER_PID=$!
    cd - > /dev/null

    # 3. Wait for it to be ready
    echo "Waiting for $URL to be online..."
    # We use a timeout to prevent infinite hangs
    for i in {1..120}; do
        if curl -s $URL > /dev/null; then
            break
        fi
        sleep 1
    done

    # Give it another second to settle
    sleep 2

    # 4. Measure Idle Memory Use
    # We get the group of processes or just the direct PID based on the framework.
    # To be safe, we capture the memory of the process listening on port 8080.
    ACTUAL_PID=$(lsof -t -i:$PORT | head -n 1)
    if [ -z "$ACTUAL_PID" ]; then
        echo "Error: Could not find process listening on $PORT"
        kill $SERVER_PID
        return 1
    fi

    RSS_KB=$(ps -o rss= -p $ACTUAL_PID | awk '{print $1}')
    RSS_MB=$(echo "scale=2; $RSS_KB / 1024" | bc)
    echo "Memory at Rest (RSS): ${RSS_MB} MB"

    # 5. Run Oha (HTTP Load Test)
    echo "Running load test (Concurrency: $CONCURRENCY, Duration: $DURATION)..."
    oha -c $CONCURRENCY -z $DURATION $URL --no-tui > "benchmarks/results_${name}.txt"
    echo "Load test complete."

    # 6. Shut down server
    kill $ACTUAL_PID 2>/dev/null || true
    kill $SERVER_PID 2>/dev/null || true
    sleep 2
    echo "Server $name stopped."
    echo ""
}

# Ensure oha is installed
if ! command -v oha &> /dev/null; then
    echo "Error: 'oha' is not installed."
    exit 1
fi

mkdir -p benchmarks

# Pre-compile rust for release before benchmarking
echo "Pre-compiling Rust backend in release mode..."
cd backend-rust && cargo build --release
cd ..

# Pre-compile Kotlin backend
echo "Pre-compiling Kotlin backend..."
cd backend-kotlin && JAVA_HOME=/Users/antonis/.sdkman/candidates/java/21.0.2-tem ./mvnw clean package -DskipTests
cd ..

# Pre-compile Java backend
echo "Pre-compiling Java backend (baseline)..."
cd backend-java && JAVA_HOME=/Users/antonis/.sdkman/candidates/java/21.0.2-tem ./mvnw clean package -DskipTests
cd ..

# Run Benchmarks
run_benchmark "Kotlin-SpringBoot" "backend-kotlin" "JAVA_HOME=/Users/antonis/.sdkman/candidates/java/21.0.2-tem java -Xms200m -Xmx1g -jar target/spring-inventory-0.0.1-SNAPSHOT.jar"
run_benchmark "Java-SpringBoot-21" "backend-java" "JAVA_HOME=/Users/antonis/.sdkman/candidates/java/21.0.2-tem java -Xms200m -Xmx1g -jar target/spring-inventory-0.0.1-SNAPSHOT.jar"
run_benchmark "Java-SpringBoot-25" "backend-java" "JAVA_HOME=/Users/antonis/.sdkman/candidates/java/25.0.2-tem java -Xms200m -Xmx1g -jar target/spring-inventory-0.0.1-SNAPSHOT.jar"
run_benchmark "Python-FastAPI" "backend-python" "uv run uvicorn main:app --port 8080 --workers 4 --loop uvloop"
run_benchmark "Rust-Axum" "backend-rust" "cargo run --release"

echo "All benchmarks complete! See benchmarks/ directory for results."
