# Meridian Developer Portal (demo)

Demo of **Docusaurus as a central documentation platform** for a large (fictional) bank. **Every existing API is auto-documented from its OpenAPI spec** — local file, drop-in, or pulled live from the running service — and teams can layer guides on top. Target: **Cloudflare**.

## Auto-documenting APIs

`npm run sync` (runs on every build, nightly in CI, and on `api-changed` dispatch) discovers specs from:

| Source | Add |
|---|---|
| Live service (SpringDoc `/v3/api-docs`, FastAPI `/openapi.json`, gateway export, raw Git URL) | entry in `apis/sources.json` (see `apis/sources.example.json`; `${ENV}` for auth) |
| Drop-in spec | `apis/<id>.yaml` / `.json` |
| Curated project with guides | `projects/<id>/openapi.yaml` + `projects/<id>/docs/` + `projects/projects.json` entry |

Each API gets an overview page, full interactive API reference, catalog/search/navbar entries and a node on the service map. Metadata (domain, owner, status, dependencies) comes from `info` / `info.x-meridian` in the spec.

| Project | Route | Spec |
|---|---|---|
| Payments Hub | `/payments` | `projects/payments/openapi.yaml` |
| Accounts & Balances | `/accounts` | `projects/accounts/openapi.yaml` |
| Card Services | `/cards` | `projects/cards/openapi.yaml` |
| FX & Treasury | `/fx` | `projects/fx/openapi.yaml` |
| Customer Onboarding (KYC) | `/kyc` | `projects/kyc/openapi.yaml` |
| Lending Origination *(auto)* | `/lending` | `apis/lending.json` |
| Notifications *(auto)* | `/notifications` | `apis/notifications.yaml` |
| Statements & Documents *(auto)* | `/statements` | `apis/statements.yaml` |

## Run

```bash
npm ci
npm start          # dev server (syncs specs + generates API docs first)
npm run build      # production build → build/
npm run preview    # build + serve on the Cloudflare runtime (wrangler dev)
npm run deploy     # build + wrangler deploy
```

## Layout

```
apis/                       drop-in specs + sources.json (live spec URLs)
projects/projects.json      curated projects (metadata overrides)
projects/<id>/docs/         hand-written guides (MDX)
projects/<id>/openapi.yaml  API contract ($refs shared/openapi/common.yaml)
shared/openapi/common.yaml  bank-wide schemas: Money, AccountRef, PartyRef, Problem …
docs/                       platform standards (/platform)
plugins/api-catalog/        exposes the registry to pages/components
src/components/ApiRef/      <ApiRef>, <SchemaRef>, <OperationTable> – build-verified links
scripts/sync-apis.mjs       discover · fetch · bundle · validate → generated/registry.json
scripts/gen-api.mjs         API reference MDX (docusaurus-plugin-openapi-docs)
wrangler.jsonc              Cloudflare Workers static-assets config
static/_headers             security + cache headers
.github/workflows/deploy.yml  CI build + Cloudflare deploy
```

## Key ideas

- **One docs plugin instance per project** — independent sidebars, versioning and ownership (`CODEOWNERS`).
- **OpenAPI → docs** via `docusaurus-plugin-openapi-docs`, with interactive *Send API Request*.
- **Shared contracts**: every spec `$ref`s `shared/openapi/common.yaml`; bundled specs downloadable at `/openapi/<id>.yaml`.
- **Integrity**: `<ApiRef project="accounts" op="getBalances" />` resolves against the other project's spec at build time — unknown operations and broken links fail the build.
- **Add an API** = drop a spec or a URL. No config changes. See `/platform/auto-documentation`.

## Cloudflare deploy

Set repo secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`; pushes to `demo-bank` deploy automatically. Or use Cloudflare Pages with build command `npm run build` and output dir `build`.
