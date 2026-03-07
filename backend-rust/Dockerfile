FROM rust:1.80-alpine AS builder
WORKDIR /app
RUN apk add --no-cache musl-dev
COPY Cargo.toml Cargo.lock ./
COPY src src
RUN cargo build --release

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/target/release/backend-rust .
EXPOSE 8080
ENTRYPOINT ["./backend-rust"]
