---
sidebar_position: 3
title: Architecture
---

# Architecture

```mermaid
flowchart LR
    GW[API Gateway] --> ACC[Accounts & Balances API]
    ACC --> CACHE[(Balance cache)]
    ACC --> LEDGER[(Core Ledger)]
    PAY[Payments Hub] -- bookings --> LEDGER
    CARDS[Card Services] -- auth holds --> LEDGER
    FX[FX & Treasury] -- settlements --> LEDGER
```

## Non-functional characteristics

| Attribute | Target |
|---|---|
| Availability | 99.95% monthly |
| p99 latency (reads) | < 150 ms |
| p99 latency (writes) | < 400 ms |
| Data residency | Primary: us-east · DR: us-west |
| Classification | Confidential – customer data |
