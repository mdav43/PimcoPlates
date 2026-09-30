# Meridian Developer Portal (demo)

Demo of **Docusaurus as a central, multi-project documentation platform** for a large (fictional) bank — five projects, each with guides and an OpenAPI spec, cross-linked through shared schemas and a build-time API catalog. Target: **Cloudflare**.

| Project | Route | Spec |
|---|---|---|
| Payments Hub | `/payments` | `projects/payments/openapi.yaml` |
| Accounts & Balances | `/accounts` | `projects/accounts/openapi.yaml` |
| Card Services | `/cards` | `projects/cards/openapi.yaml` |
| FX & Treasury | `/fx` | `projects/fx/openapi.yaml` |
| Customer Onboarding (KYC) | `/kyc` | `projects/kyc/openapi.yaml` |

## Run

```bash
npm ci
npm start          # dev server (bundles specs + generates API docs first)
npm run build      # production build → build/
npm run preview    # build + serve on the Cloudflare runtime (wrangler dev)
npm run deploy     # build + wrangler deploy
```

## Layout

```
projects/projects.json      registry – drives navbar, footer, home, catalog, plugins
projects/<id>/docs/         hand-written guides (MDX)
projects/<id>/openapi.yaml  API contract ($refs shared/openapi/common.yaml)
shared/openapi/common.yaml  bank-wide schemas: Money, AccountRef, PartyRef, Problem …
docs/                       platform standards (/platform)
plugins/api-catalog/        builds cross-project operation catalog (global data)
src/components/ApiRef/      <ApiRef>, <SchemaRef>, <OperationTable> – build-verified links
scripts/                    bundle-specs (Redocly) + gen-api (openapi-docs plugin)
wrangler.jsonc              Cloudflare Workers static-assets config
static/_headers             security + cache headers
.github/workflows/deploy.yml  CI build + Cloudflare deploy
```

## Key ideas

- **One docs plugin instance per project** — independent sidebars, versioning and ownership (`CODEOWNERS`).
- **OpenAPI → docs** via `docusaurus-plugin-openapi-docs`, with interactive *Send API Request*.
- **Shared contracts**: every spec `$ref`s `shared/openapi/common.yaml`; bundled specs downloadable at `/openapi/<id>.yaml`.
- **Integrity**: `<ApiRef project="accounts" op="getBalances" />` resolves against the other project's spec at build time — unknown operations and broken links fail the build.
- **Add a project** = registry entry + folder. See `/platform/add-a-project`.

## Cloudflare deploy

Set repo secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`; pushes to `demo-bank` deploy automatically. Or use Cloudflare Pages with build command `npm run build` and output dir `build`.
