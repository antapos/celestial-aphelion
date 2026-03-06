FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY InventorySimulator.java ItemBean.java ./
RUN javac InventorySimulator.java ItemBean.java
ENTRYPOINT ["java", "InventorySimulator"]
