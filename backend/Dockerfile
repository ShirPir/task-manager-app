# Official Golang image as a parent image
FROM golang:1.22-alpine as builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
#RUN go build -o main .
RUN go build -o backend-api .

# Use a minimal Alpine image for the final stage
FROM alpine:latest
WORKDIR /app

# Copy the built binary from the builder stage
#COPY --from=builder /app/main .
#COPY --from=builder /app/init.sql .
COPY --from=builder /app/backend-api /app/backend-api

EXPOSE 8080

# Command to run the application
CMD ["./backend-api"]