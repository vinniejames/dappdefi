# Dapp DeFi

An open-source, markdown-powered directory of DeFi protocols. Hosted as a static site on GitHub Pages with client-side search via [Pagefind](https://pagefind.app/).

500+ protocols, organized by what they actually do (lending, DEX, perps, liquid staking, restaking, RWA, and more) rather than by chain.

The data is the markdown. Every protocol is a `.md` file in `src/content/protocols/`. Hand-edits, PR contributions, and corrections live there permanently. The site rebuilds from those files on every push.

## Why

Most DeFi directories are TVL leaderboards. This is a directory — a place to look up what a protocol *is*, what it does, and how it compares to its peers. Each entry has a hand-written description, a structured tag block (governance, custody, audit status, launch year), and links out.

The data is opinionated by design: every protocol is normalized into one of fifteen canonical categories, with a small per-category subcategory vocabulary. No "Other" dumping ground unless we genuinely don't know.

## How it works

- **Stack**: [Astro 5](https://astro.build/) content collections + [Tailwind v3](https://tailwindcss.com/) + [Pagefind](https://pagefind.app/) for search. Static output, deployed via [`withastro/action`](https://github.com/withastro/action).
- **Source of truth**: `src/content/protocols/*.md`. Every protocol is one markdown file with structured frontmatter.
- **Search**: Pagefind builds a static index from the rendered HTML at build time. No server, no API.

## Categories

Every protocol is normalized to exactly one of:

`lending` · `dex` · `perps` · `liquid-staking` · `yield` · `bridges` · `stablecoins` · `rwa` · `restaking` · `infrastructure` · `prediction-markets` · `nft-fi` · `gaming` · `social` · `other`

Subcategory vocabulary is fixed per category — see `src/data/categories.ts`. Examples:

- **lending**: money-market, overcollateralized, undercollateralized, isolated-pools, cdp, fixed-rate
- **dex**: amm, clmm, orderbook, aggregator, stableswap, intent-based
- **bridges**: lock-mint, liquidity-pool, messaging, intent-based

## Contributing — add or edit your project's page

The repo is the source of truth. Every protocol is one markdown file at `src/content/protocols/{your-slug}.md`. To **fix** a description or change a tag, edit that file. To **add** a new protocol, create the file from the template below.

### Quick start

1. Fork the repo and clone your fork.
2. Create a branch: `git checkout -b add/my-protocol`.
3. Copy the template below into `src/content/protocols/{your-slug}.md`. Use a lowercase, kebab-case slug derived from your URL or token ticker (`my-protocol`, `my-protocol-v2`).
4. Drop a logo PNG or SVG (≥256×256, square) into `public/logos/{your-slug}.png` and reference it as `logo: /logos/{your-slug}.png`. Or leave `logo: null` and we'll show an initials placeholder.
5. Run `npm install && npm run dev` and open `http://localhost:4321/protocols/{your-slug}/` to preview.
6. Run `npx astro check` — this validates your frontmatter against the schema. If it errors, the message tells you which field is wrong.
7. Open a PR. Tag it with the canonical category in the title (e.g. `add(lending): rocko`).

### Template — copy into `src/content/protocols/{your-slug}.md`

```markdown
---
name: My Protocol                        # display name
category: lending                        # one of: lending, dex, perps, liquid-staking, yield,
                                          # bridges, stablecoins, rwa, restaking, infrastructure,
                                          # prediction-markets, nft-fi, gaming, social, other
subcategories: [money-market, overcollateralized]
                                          # 1–3 entries, picked from the category's allowed
                                          # list in src/data/categories.ts. Schema rejects
                                          # unknown values.
chains: [Ethereum, Base]                 # at least one. Use chain display names with proper
                                          # capitalization (e.g. "Ethereum", not "eth").
url: https://example.com                 # required, https
twitter: myprotocol                      # handle without @, or null
github: my-org/my-repo                   # owner/repo or owner, or null
logo: /logos/my-protocol.png             # absolute URL or local path under public/, or null
listed_at: 2026-04-29                    # ISO date — when this entry was added
tags:
  governance: dao                        # dao | multisig | foundation | unknown
  token: MYP                             # ticker, or null
  audited: true                          # true | false | unknown
  open_source: true                      # true | false | unknown
  custody: non-custodial                 # non-custodial | custodial | hybrid | unknown
  permissions: permissionless            # permissionless | permissioned | hybrid | unknown
  launched: 2024                         # year (number), or unknown
  # maturity is computed automatically — leave it off and the build will set it.
---

My Protocol is a [one-sentence description that becomes the lead paragraph]. The lead paragraph is rendered prominently, so write it as a tagline: what the protocol is, who it's for, and the single thing that distinguishes it from the rest of its category.

[Second paragraph: how it works at a high level. Mechanics, architecture, key primitives. Describe in plain language what actually happens on-chain.]

[Optional third paragraph: what's notable, who built it, governance and token model, audits, integrations.]
```

### Editing an existing protocol

Just edit the markdown file at `src/content/protocols/{slug}.md`. The slug matches the URL (e.g. `aave-v3.md` → `/protocols/aave-v3/`).

You can change anything in the frontmatter except the filename (which is the slug) and `listed_at` (historical record). For descriptions, the lead paragraph (first `<p>`) gets special styling — keep it punchy.

### Featuring your project

`src/data/featured.json` is hand-curated. Each canonical category lists up to 3 slugs that show on the homepage row for that category. Edit the JSON to swap a slug in or out.

```json
{
  "lending": ["rocko", "aave-v3", "morpho-blue"],
  "yield":   ["kairos", "pendle", "spark-savings"]
}
```

The list silently skips any slug that doesn't exist, so it's safe to leave entries that get removed elsewhere.

### Style and tone

- Prefer **`unknown`** over guessing for any tag — `audited: unknown` is honest; `audited: true` without evidence is misleading.
- Write descriptions in your own words. Don't paste marketing copy verbatim.
- 2–3 paragraphs is right for most protocols; longer is fine if the project is unusually substantive.
- Mention competitors or close peers when it helps frame the protocol's position (e.g. "similar to Pendle but with a perps-style UX").

### What we won't accept

- Outright shilling or unverifiable performance claims.
- Protocols with no working product (whitepaper-only).
- Protocols that are clearly scams, rug pulls, or misrepresentation.
- Frontmatter values that fail `npx astro check`.

For more detail, see [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Local development

```bash
npm install
npm run dev          # local dev server
npm run build        # static build + Pagefind index
npm run preview      # serve dist/ locally
npx astro check      # validate all protocol frontmatter against the schema
```

## License

MIT — see [`LICENSE`](./LICENSE).

All written descriptions and curation are original to this project and may be reused under the MIT license.
