# Monitoring

## Key Metrics

- Transaction success rate
- Confirmation latency
- Horizon API response times
- Account sequence number drift
- Fee budget utilization

## Tools

- Prometheus + Grafana for metrics aggregation
- OpenTelemetry for distributed tracing
- Structured logging via the `logger` module

## Alerts

Configure alerts for:

- Failed transactions (>1% rate)
- High latency (>10s P99)
- Horizon connectivity issues
- Sequence number out of sync
