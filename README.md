# 🧠 Product Price Aggregator - MVP

A real-time backend system to simulate and aggregate pricing and availability data for digital products (like courses, books, software) from third-party providers.

Built using **NestJS**, **Prisma**, **PostgreSQL**, **Redis**, and follows clean modular architecture, SOLID principles, and concurrent job handling patterns.

---

## 🚀 Getting Started

### ✅ Prerequisites
- Node.js (LTS)
- Docker & Docker Compose

### ⚙️ Run Project

```bash
sh create-env.sh                # Set environment variables
npm install                     # Install all project dependencies
docker-compose up -d            # Starts PostgreSQL and Redis
npm run setup:db                # Runs migrations and seeds data
npm run start:dev               # Starts the NestJS app in watch mode
```

---

## 🧾 API Documentation

Access Swagger docs:  
👉 [http://localhost:3000/api/docs#/](http://localhost:3000/api/docs#/)

---

## 🧪 Testing

```bash
npm run test:unit   # Unit tests
npm run test:e2e    # Integration (E2E) tests
```

- **Unit Test:** Ensures sync logic tracks only real changes (price/availability).
- **Integration Test:** Verifies full flow of change detection via `/products/changes`.

---

## 🧱 Architecture Overview

### 📦 External Provider Simulation
- 3 provider modules (Amazon, Noon, Careem)
- Isolated modules simulate independent APIs and update logic

### 🔄 Scheduler Module
- Runs periodic cron jobs to trigger eligible provider fetches
- Delegates to Fetcher for retry-aware fetches
- Triggers stale marking job

### 📥 Fetcher Module
- Pulls data from provider endpoints using HTTP + retry logic
- Publishes raw products to Bull queue

### 🐂 Queue Module
- Handles `raw-product` queue using Bull
- Bridges async fetch and sync logic

### 🧠 Product Module
- **Consumer:** Normalizes and syncs product data
- **Sync Logic:** Upserts product-provider, creates history only on change
- **Stale Marker:** Marks outdated entries
- **Controller:** Exposes 3 APIs:
  - `/products` with filters
  - `/products/:id` with provider info and history
  - `/products/changes` for recent diffs
- **Stream Controller:** Powers `/stream/dashboard` dashboard via SSE

---

## ⚖️ Design Decisions & Trade-offs

### 🔍 1. Prisma Native Queries
Chose Prisma’s native query engine over raw SQL to ensure:
- Type safety & maintainability
- Clean delta tracking logic
- Avoid N+1 queries via smart mapping/grouping

### 🕒 2. Change Detection Logic
Includes first entry even if unchanged to avoid false negatives.
✅ More transparent and easier to debug.

⚠️ Might overreport changes if history is just starting — acceptable for MVP.

### ♻️ 3. Job Concurrency with Promise.allSettled
Used `Promise.allSettled` for concurrency in scheduler jobs to:
- Prevent single failure from halting the full batch
- Gracefully log individual provider fetch errors

⚠️ Could lead to unhandled internal errors per job — manageable via logs in MVP.

### 🔄 4. Only Track Meaningful Changes
- Sync logic avoids duplicate history writes unless price/availability changed
- Keeps history lightweight, improves query efficiency
- Works with `since` filtering logic in stream and API

### 📊 5. Query Layer Tradeoff
- Prioritize grouping by product and provider to simplify consumer response
- Avoid raw SQL for maintainability
- Slight over-reporting allowed for first-time entries (safe for MVP)

### 🧱 6. Modular Provider Architecture
- Each provider module simulates real-world external APIs independently
- Allows future evolution into microservices per provider

### ⏳ 7. Staleness Detection via Configurable Threshold
- Provider config includes `staleAfterMs`
- Scheduler marks data stale if not refreshed within this interval

### ⚙️ 8. Normalization via Factory Pattern
- Normalizers abstract away provider-specific data shapes
- Used Factory + Interface to keep sync logic clean (SRP & OCP)

---

## 📈 Realtime Dashboard

Live product change stream via SSE

📍 [http://localhost:3000/stream/dashboard](http://localhost:3000/stream/dashboard)

- Instant updates every 5s
- Flash animation for new entries
- Fallback UI for no changes

---

## 🔮 Improvements & Next Steps

- Parallel batch fetching across providers
- Retry with backoff + DLQ
- Metrics + observability
- Rate limiting for real APIs
- Plugin-based normalizers

---

## 👨‍💻 Author

Designed and built to showcase:
- Clean backend architecture
- Real-world async data flow
- SOLID principles
- Effective testing and design thinking
