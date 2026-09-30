---
title: API standards
---

# API standards

All Meridian APIs **must** reuse the components in [`shared/openapi/common.yaml`](https://github.com/mdav43/pimcoplates/blob/demo-bank/shared/openapi/common.yaml).

```yaml title="projects/<id>/openapi.yaml"
components:
  schemas:
    Payment:
      properties:
        amount:
          $ref: '../../shared/openapi/common.yaml#/components/schemas/Money'
```

## Authentication

OAuth 2.0 client credentials against `https://auth.meridian.example/oauth2/token`, plus mutual TLS at the gateway. Scopes are namespaced per project (`payments:write`, `accounts:read`, …).

## Conventions

| Topic | Rule |
|---|---|
| Money | `Money { amount: decimal-string, currency: ISO-4217 }` — never floats |
| Errors | RFC 9457 `application/problem+json` using shared `Problem` |
| Idempotency | `Idempotency-Key` header required on every `POST` that creates state |
| Tracing | `X-Correlation-Id` propagated end-to-end |
| Pagination | Cursor-based: `cursor` + `limit`, response `page: PageInfo` |
| Versioning | Major version in path (`/payments/v2`); additive changes only within a major |
| operationId | Required, camelCase, unique — it becomes the doc URL |
