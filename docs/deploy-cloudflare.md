---
title: Deploy to Cloudflare
---

# Deploy to Cloudflare

The site is a static build (`build/`) served by **Cloudflare Workers static assets** — configured in `wrangler.jsonc`.

```bash
npm ci
npm run build           # sync specs → generate API docs → docusaurus build
npx wrangler login      # once
npm run deploy          # build + wrangler deploy
npm run preview         # local Cloudflare runtime at http://localhost:8787
```

## CI/CD

`.github/workflows/deploy.yml` builds on every push/PR, nightly, and on `api-changed` dispatch events, and deploys to Cloudflare. Secrets:

| Secret | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | API token with *Workers Scripts: Edit* |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |
| `SPEC_FETCH_TOKEN` | (optional) credential used by `apis/sources.json` to read live specs |

If specs are only reachable inside the bank network, run the job on a self-hosted runner.

## Alternative: Cloudflare Pages (Git integration)

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output directory | `build` |
| Environment | `NODE_VERSION=22` |

Security headers and caching live in `static/_headers` and are honoured by both Workers assets and Pages.

## Restricting access

Internal bank docs should sit behind **Cloudflare Access** (Zero Trust): add an Access application for the portal hostname and bind it to your IdP (Entra ID / Okta) groups.
