# Contributing

The directory is markdown. Every protocol lives in `src/content/protocols/{slug}.md`. To fix something, just edit the file.

## What you can change

- **Description**: rewrite or improve the body of a protocol's `.md` file.
- **Tags**: change `governance`, `custody`, `permissions`, `launched`, `token`, `audited`, `open_source` if you have better info. Prefer `unknown` over guesses.
- **Subcategories**: pick from the allowed list for the protocol's category in `src/data/categories.ts`. Up to three per protocol.
- **Featured projects**: edit `src/data/featured.json` directly. The format is `{ "<category-slug>": ["<protocol-slug>", ...] }`. Maximum three per category. If a featured slug stops existing, the homepage skips it silently — no error.
- **New protocol**: create a new `.md` file with the frontmatter shape below.

## What you can't change easily

- **The slug** — it's the filename. Renaming breaks links. Open an issue first if you need this.
- **The category** — it changes which row a protocol shows up in on the homepage and `/categories/`. Be sure before changing.
- **`listed_at`** — historical record of when the protocol entered the directory.

## Frontmatter reference

```yaml
---
name: Aave V3
category: lending                        # canonical category, see src/data/categories.ts
subcategories: [money-market, overcollateralized, isolated-pools]
chains: [Ethereum, Arbitrum, Base, ...]
url: https://aave.com
twitter: aave                            # handle without @, or null
github: aave-dao/aave-v3-origin          # owner/repo or owner, or null
logo: /logos/aave-v3.png                 # absolute URL or local path under public/, or null
listed_at: 2026-04-29                    # ISO date
tags:
  governance: dao                        # dao | multisig | foundation | unknown
  token: AAVE                            # ticker, or null
  audited: true                          # true | false | unknown
  open_source: true                      # true | false | unknown
  custody: non-custodial                 # non-custodial | custodial | hybrid | unknown
  permissions: permissionless            # permissionless | permissioned | hybrid | unknown
  launched: 2022                         # year, or unknown
  maturity: established                  # established | growing | new (computed by writer script — leave it)
---
```

The body should be **2–3 paragraphs**. Cover what the protocol does, how it works at a high level, and what makes it notable. Always describe in your own words — don't paste marketing copy verbatim.

## Subcategory vocabulary

Each category has a fixed list of allowed subcategories. The schema rejects unknown values. See `src/data/categories.ts` for the full table.

## Automation

The Sunday update workflow (`.github/workflows/update.yml`) only opens issues for new protocols — it never modifies existing files and never touches `featured.json`. All enrichment is done by humans (or Claude Code running locally), gated through PRs. There is no API key used in CI.

## Running locally

```bash
npm install
npm run dev          # local dev server with hot reload
npm run build        # static build + Pagefind index
npm run preview      # serve dist/
npm run check        # astro check (validates frontmatter against the zod schema)
```

`npm run check` is the fastest way to verify a content change before opening a PR.

## License

By contributing, you agree your contributions are licensed under the MIT license, same as the rest of the repo.
