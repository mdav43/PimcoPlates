---
sidebar_position: 3
title: Architecture
---

# Architecture

```mermaid
flowchart LR
    GW[API Gateway] --> FXAPI[FX & Treasury API]
    FXAPI --> PRICER[Pricing Engine]
    PRICER --> LP[(Liquidity Providers)]
    FXAPI --> TMS[(Treasury Mgmt System)]
    TMS -.settlement.-> ACC[(Accounts)]
```

## Non-functional characteristics

| Attribute | Target |
|---|---|
| Availability | 99.95% monthly |
| p99 latency (reads) | < 150 ms |
| p99 latency (writes) | < 400 ms |
| Data residency | Primary: us-east · DR: us-west |
| Classification | Confidential – customer data |
