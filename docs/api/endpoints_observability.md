# API Specifications & Observability

EduVerse exposes a REST API powered by Swagger documentation and structured monitoring telemetry.

## API Success & Error Envelopes

Every JSON payload returned by `/api/v1` is structured under a unified envelope to simplify frontend state parsing.

### 1. HTTP 2xx Success Envelope
```json
{
  "success": true,
  "data": {
    "module": "auth",
    "status": "Active"
  },
  "traceId": "0190eebe-86c2-7fc0-8abf-4efc354721ab",
  "timestamp": "2026-07-26T21:03:42.000Z"
}
```

### 2. HTTP 4xx/5xx Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "ERR_400",
    "message": "Bad Request",
    "details": {
      "message": ["email must be an email address"],
      "error": "Bad Request",
      "statusCode": 400
    }
  },
  "traceId": "0190eebe-86c2-7fc0-8abf-4efc354721ab",
  "timestamp": "2026-07-26T21:03:42.000Z"
}
```

---

## Health Check Routes
- **`/api/v1/health`**: Global uptime tracker.
- **`/api/v1/health/live`**: Fast endpoint responding immediately.
- **`/api/v1/health/ready`**: Verifies PostgreSQL connection and Redis availability.

---

## Metrics & Tracing (OTel + Prometheus)
- **OpenTelemetry SDK**: Automatically active when NestJS boots. Scrapes Express HTTP requests, PostgreSQL queries, and Redis operations.
- **OTel Collector**: Listens on ports `4317` (gRPC) and `4318` (HTTP) in the Docker network.
- **Prometheus Scraper**: Connects to the Otel-collector on port `8889` to ingest CPU, memory, and routing metrics.
- **Grafana Panel**: Integrated with Prometheus data source. Reached locally on port `3002`.
