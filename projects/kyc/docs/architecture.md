---
sidebar_position: 3
title: Architecture
---

# Architecture

```mermaid
flowchart LR
    UI[Onboarding UI] --> GW[API Gateway] --> KYC[KYC API]
    KYC --> IDV[ID&V Vendor]
    KYC --> SCR[Screening Engine]
    SCR --> LISTS[(OFAC / HMT / EU lists)]
    KYC --> CRM[(Party Master)]
```

## Non-functional characteristics

| Attribute | Target |
|---|---|
| Availability | 99.95% monthly |
| p99 latency (reads) | < 150 ms |
| p99 latency (writes) | < 400 ms |
| Data residency | Primary: us-east · DR: us-west |
| Classification | Confidential – customer data |
