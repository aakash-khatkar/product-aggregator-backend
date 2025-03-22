#!/bin/bash

cat <<EOF > .env
# .env
DATABASE_URL=postgresql://user:pass@localhost:5432/price_aggregator
PORT=3000
DEFAULT_FETCH_INTERVAL_MS=10000
REDIS_HOST=localhost
REDIS_PORT=6379
STREAM_POLL_INTERVAL=5000
WINDOW_MS=10000
EOF

echo ".env file created successfully!"