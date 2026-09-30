---
sidebar_position: 3
title: Architecture
---

# Architecture

```mermaid
flowchart LR
    subgraph Channels
      OB[Online Banking]
      H2H[Host-to-Host]
    end
    OB & H2H --> GW[API Gateway]
    GW --> PH[Payments Hub]
    PH --> R{Rail Router}
    R --> ACH & FED[Fedwire] & SEPA & SWIFT
    PH -.screening.-> KYC[(KYC)]
    PH -.quotes.-> FX[(FX)]
    PH -.funds check / booking.-> ACC[(Accounts)]
```

## Non-functional characteristics

| Attribute | Target |
|---|---|
| Availability | 99.95% monthly |
| p99 latency (reads) | < 150 ms |
| p99 latency (writes) | < 400 ms |
| Data residency | Primary: us-east · DR: us-west |
| Classification | Confidential – customer data |
