#!/bin/bash

cat <<EOF > .env
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/price_aggregator
REDIS_HOST=localhost
REDIS_PORT=6379

# Demo-friendly aggressive intervals
DEFAULT_FETCH_INTERVAL_MS=5000
STREAM_POLL_INTERVAL=5000
WINDOW_MS=10000
EOF

echo ".env file created successfully!"