---
title: Add a project
---

# Add a project

:::tip Only need API docs?
Drop the spec into `apis/` or add its URL to `apis/sources.json` — see [Auto-documenting APIs](./auto-documentation.md). The steps below are for teams that also want guides.
:::

Onboarding a curated project takes a registry entry, a spec and a docs folder — no config changes.

1. **Register** it in `projects/projects.json`:

   ```json
   {
     "id": "lending",
     "name": "Lending Origination",
     "domain": "Retail Lending",
     "owner": "Lending Squad",
     "status": "Beta",
     "version": "0.1.0",
     "summary": "Loan applications, decisioning and disbursement.",
     "dependsOn": ["kyc", "accounts"]
   }
   ```

2. **Add** `projects/lending/openapi.yaml` (reuse shared components via `$ref`).
3. **Add** `projects/lending/docs/` with any guides (`intro.mdx` is required; e.g. `getting-started.mdx`, `architecture.md`, `integrations.mdx`). The sidebar is built automatically, ordered by `sidebar_position`.

On the next build the project appears in the navbar, footer, home page, API catalog and search, and its API reference is generated automatically.

## Ownership at scale

- Put a `CODEOWNERS` entry per `projects/<id>/` so each team approves its own docs.
- Teams can instead keep docs in their own repo and sync `docs/` + `openapi.yaml` here in CI (git submodule or artifact pull) — the portal only needs the files at build time.
- The build fails on broken links, unknown `<ApiRef>` operations and invalid specs, so the portal is a quality gate.
