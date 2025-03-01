# Official Golang image as a parent image
FROM golang:1.22-alpine as builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o main .

# Use a minimal Alpine image for the final stage
FROM alpine:latest
WORKDIR /app

# Copy the built binary from the builder stage
COPY --from=builder /app/main .
COPY --from=builder /app/init.sql .
EXPOSE 8080

# Command to run the application
CMD ["./backend-api"]