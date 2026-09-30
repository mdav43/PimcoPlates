---
title: Add a project
---

# Add a project

Onboarding a new team takes three files and no config changes.

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
3. **Add** `projects/lending/docs/` with `intro.mdx`, `getting-started.mdx`, `architecture.md`, `integrations.mdx`, `changelog.md`, and a `sidebars.ts`:

   ```ts title="projects/lending/sidebars.ts"
   import {projectSidebar} from '../../src/sidebars/projectSidebar';
   export default {main: projectSidebar(__dirname)};
   ```

On the next build the project appears in the navbar, footer, home page, API catalog and search, and its API reference is generated automatically.

## Ownership at scale

- Put a `CODEOWNERS` entry per `projects/<id>/` so each team approves its own docs.
- Teams can instead keep docs in their own repo and sync `docs/` + `openapi.yaml` here in CI (git submodule or artifact pull) — the portal only needs the files at build time.
- The build fails on broken links, unknown `<ApiRef>` operations and invalid specs, so the portal is a quality gate.
