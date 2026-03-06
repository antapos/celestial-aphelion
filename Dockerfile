FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY HelloWorld.java .
RUN javac HelloWorld.java
ENTRYPOINT ["java", "HelloWorld"]
