# PIMCO Plates™

> Total Return on Tableware.

A (parody) landing page for the bond firm's imaginary side hustle: restaurant
plates and bowls that reveal an unsettling financial question once you've
cleared your meal — *"Is your money safe?"*, *"Are you retirement ready?"*

It's a single static `index.html` — no build step, no dependencies.

## Run locally

Just open the file:

```sh
open index.html      # macOS
xdg-open index.html  # Linux
```

## Publishing on GitHub Pages

This repo ships a workflow (`.github/workflows/pages.yml`) that deploys the
site automatically on every push to the default branch.

To turn it on once:

1. Go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.

The site will then be live at `https://<user>.github.io/<repo>/`.

## Disclaimer

Parody. Not affiliated with Pacific Investment Management Company LLC. Not
financial advice. Please consult a human, not a bowl.
