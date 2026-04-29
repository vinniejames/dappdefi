# DeFi Directory

An open-source, markdown-powered directory of DeFi protocols. Hosted as a static site on GitHub Pages with client-side search via [Pagefind](https://pagefind.app/).

500 protocols at the seed — organized by what they actually do (lending, DEX, perps, liquid staking, restaking, RWA, and more) rather than by chain.

The data is the markdown. Every protocol is a `.md` file in `src/content/protocols/`. Hand-edits, PR contributions, and corrections live there permanently. The site rebuilds from those files on every push.

## Why

Most DeFi directories are TVL leaderboards. This is a directory — a place to look up what a protocol *is*, what it does, and how it compares to its peers. Each entry has a hand-written description, a structured tag block (governance, custody, audit status, launch year), and links out.

The data is opinionated by design: every protocol is normalized into one of fifteen canonical categories, with a small per-category subcategory vocabulary. No "Other" dumping ground unless we genuinely don't know.

## How it works

- **Stack**: [Astro 5](https://astro.build/) content collections + [Tailwind v3](https://tailwindcss.com/) + [Pagefind](https://pagefind.app/) for search. Static output, deployed via [`withastro/action`](https://github.com/withastro/action).
- **Discovery**: [external's `/protocols` endpoint](https://example.com/protocols) is used as a discovery source — it tells us which protocols exist and where they're deployed. Nothing else.
- **Enrichment**: descriptions and metadata are written by Claude Code (the agent) directly during seed and update runs. There is no LLM-calling code, no Anthropic SDK dependency, and no `ANTHROPIC_API_KEY` anywhere in the build, deploy, or update pipeline.
- **Source of truth**: `src/content/protocols/*.md`. Update runs only *add* new files; they never modify existing ones.
- **Search**: Pagefind builds a static index from the rendered HTML at build time. No server, no API.

## Categories

Every protocol is normalized to exactly one of:

`lending` · `dex` · `perps` · `liquid-staking` · `yield` · `bridges` · `stablecoins` · `rwa` · `restaking` · `infrastructure` · `prediction-markets` · `nft-fi` · `gaming` · `social` · `other`

Subcategory vocabulary is fixed per category — see `src/data/categories.ts`. Examples:

- **lending**: money-market, overcollateralized, undercollateralized, isolated-pools, cdp, fixed-rate
- **dex**: amm, clmm, orderbook, aggregator, stableswap, intent-based
- **bridges**: lock-mint, liquidity-pool, messaging, intent-based

## Contributing

PRs welcome. The repo is the source of truth — to fix a description, change a tag, or add a missing protocol, edit the markdown directly.

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the full PR flow, the frontmatter reference, and how to edit `src/data/featured.json`.

## Local development

```bash
npm install
npm run dev          # local dev server
npm run build        # static build + Pagefind index
npm run preview      # serve dist/ locally
```

### Running the discovery pipeline

```bash
npm run fetch-raw -- --mode=seed     # snapshot top 500 by TVL  (or --mode=update for top 1000)
npm run identify-new -- --mode=seed  # diff snapshot vs existing slugs → .cache/queue.json
```

### Draining the queue (Claude Code)

After a queue exists, point Claude Code at this repo and ask it to drain `.cache/queue.json` in batches of 25. For each entry it should:

1. Rewrite the description into 2–3 paragraphs in the project's voice (no copied phrasing from external).
2. Pick 1–3 subcategories from the category's allowed list (see `src/data/categories.ts`).
3. Fill the tag block — prefer `unknown` over guessing.
4. Pipe the assembled JSON array into `tsx scripts/write-batch.ts`.

Per-batch commits make the run resumable from `git log`.

## Update cycle

`update.yml` runs every Sunday at 00:00 UTC (and on manual dispatch). It only fetches and diffs — it does not enrich. If the diff is non-empty, it opens an issue containing a slug checklist plus the queue JSON. A human runs Claude Code locally to drain the queue and opens a PR.

This split is deliberate: it keeps the no-API-key constraint clean and adds a human checkpoint on what enters the directory.

## License

MIT — see [`LICENSE`](./LICENSE).

Discovery data sourced from [external](https://external.com/), used under fair-use citation. All written descriptions are original to this project and may be reused under the MIT license.
