# agentic-workflows

A React (Vite) dashboard displaying live and backtested strategy
performance, deployed automatically to GitHub Pages.

## How it works

- Strategy source code and raw journals live in private repos.
- Each strategy publishes curated summary metrics (no code, no
  credentials) to a private data repo.
- This repo's build workflow checks out that private data at build
  time, bakes it into the static site, and deploys to GitHub Pages.
  The data repo itself is never exposed to site visitors.
- The data repo notifies this repo to rebuild automatically whenever
  any strategy publishes new results, so the dashboard stays close to
  real-time without polling on a fixed schedule.

## Local development

```
npm install
npm run build   # requires public/data/*.json + manifest.json to exist locally
npm run dev
```
