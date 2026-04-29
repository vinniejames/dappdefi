# Agent guide

Notes for future AI agents (Claude Code, Cursor, etc.) picking up this codebase. Aimed at high signal density — read end-to-end before making changes.

## What this is

Dapp DeFi (`dappdefi.com`) is a static, markdown-driven directory of DeFi protocols. Astro 5 + Tailwind v3 + Pagefind. Each protocol is one `.md` file in `src/content/protocols/` and is the canonical source of truth — edits, contributions, and corrections all land there.

The user (`vinniejames` / Vince DePalma) is co-founder of [Rocko](https://rocko.co) and runs this directory as a side project. Rocko is featured prominently in lending; treat the user as a practitioner with deep DeFi expertise, not a beginner.

## Repo layout

```
src/
  content/
    config.ts             # zod schema — note: NO `slug` field (see gotchas)
    protocols/*.md        # 500+ entries, the source of truth
  data/
    categories.ts         # 15 canonical categories + per-category subcategory vocab
    featured.json         # hand-curated homepage rows (3 slugs per category)
    seeded-at.json        # snapshot of the initial seed run
  layouts/BaseLayout.astro
  components/             # SearchBar, ProtocolCard, FeaturedRow, TagPill, Filters
  pages/
    index.astro
    protocols/[...slug].astro
    categories/[category].astro
    chains/[chain].astro
  lib/
    utm.ts                # withUtm() and relForLink() helpers for outbound links
  styles/global.css       # .protocol-body class is the description typography

scripts/
  lib/categorize.ts       # external category → canonical category (the only "judgment" in the pipeline)
  fetch-raw.ts            # GET external, snapshot top N
  identify-new.ts         # diff snapshot vs existing → .cache/queue.json
  write-markdown.ts       # zod-validated single-entry writer (stdin JSON)
  write-batch.ts          # zod-validated array writer (stdin JSON array)
  sync.ts                 # one-shot: fetch + diff + write stubs (npm run sync)
  set-link-type.ts        # CLI to flip nofollow/follow/sponsored (npm run link-policy)
  build-featured.ts       # rebuild featured.json from a snapshot (rarely needed)

public/
  logos/*                 # self-hosted logos (rocko.png, kairos.svg, coinfox.png)

.github/workflows/
  deploy.yml              # withastro/action@v3 → GitHub Pages
  update.yml              # weekly cron, opens an issue with new protocols (no enrichment in CI)

.cache/                   # gitignored; queue.json + raw snapshots
```

## Common tasks

### Add a new protocol manually

Easiest path — pipe JSON to `write-markdown.ts`:

```bash
cat <<'EOF' | npx tsx scripts/write-markdown.ts
{
  "slug": "my-protocol",
  "name": "My Protocol",
  "category": "lending",
  "subcategories": ["money-market"],
  "chains": ["Ethereum"],
  "url": "https://example.com",
  "twitter": "handle", "github": "owner/repo", "logo": "/logos/my-protocol.png",
  "description": "Two to three paragraphs in our voice…",
  "tags": { "governance": "dao", "token": "TKN", "audited": true,
            "open_source": true, "custody": "non-custodial",
            "permissions": "permissionless", "launched": 2024 }
}
EOF
```

It validates against the zod schema (categories.ts subcategory whitelist, slug regex, etc.) and refuses to overwrite existing files. For multiple at once use `scripts/write-batch.ts` with a JSON array.

For logos, drop the asset under `public/logos/` and reference `/logos/<slug>.png` (or `.svg`). The schema accepts either an absolute URL or a `/`-rooted path.

### Edit an existing protocol

Just edit `src/content/protocols/<slug>.md` directly. The slug is the filename — never rename the file (breaks URLs). To check your changes, `npx astro check` validates frontmatter against the schema.

### Remove a protocol

```bash
rm src/content/protocols/<slug>.md
# Then check if it was in featured.json:
grep <slug> src/data/featured.json   # if found, delete the line — featured silently skips missing slugs
```

### Discover and add new protocols (periodic)

```bash
npm run sync              # fetch external, diff, write stubs for new protocols only
npm run sync -- --dry-run # preview without writing
npm run sync -- --limit=20  # cap at 20 new entries this run
```

The script is idempotent — re-running it after the first pass writes 0 new files because everything's already on disk. Threshold: TVL > $10M OR rank ≤ 1000 in the external snapshot. New entries get auto-inferred tags (audited from external audit count, token from symbol, etc.) and a stub description seeded from external's text.

After running sync, polish the stub descriptions — external's text is fine as a seed but **don't ship it verbatim**. Edit each new file to rewrite the description in the project's voice (2–3 paragraphs, lead sentence punchy).

### Update link SEO policy (follow / nofollow / sponsored)

```bash
# Flip one or many slugs to follow:
npm run link-policy follow rocko kairos coinfox

# Back to nofollow (the default):
npm run link-policy nofollow some-old-feature

# Google-compliant paid disclosure:
npm run link-policy sponsored a-paid-listing
```

Default for the 500 seed protocols is `nofollow`. `link_type: follow` in frontmatter strips nofollow off the website / twitter / github links so the protocol gets editorial PageRank. Reserve for features and paid placements.

### Manage the homepage featured rows

Edit `src/data/featured.json` directly. Each canonical category gets up to 3 slugs displayed on the homepage. The first slug appears top-left (most prominent placement).

```json
{
  "lending": ["rocko", "aave-v3", "morpho-blue"],
  "yield":   ["kairos", "pendle", "spark-savings"]
}
```

Missing slugs are silently skipped — no errors if you remove a protocol that was featured.

### Build and check

```bash
npm run dev          # Astro dev server (Pagefind search inactive in dev)
npm run build        # Astro build + Pagefind index
npm run preview      # serve dist/ on localhost:4321
npx astro check      # TypeScript + zod schema check
```

For full search testing you need build + preview, not dev.

## Conventions

- **Description body**: 2–3 paragraphs. First paragraph is rendered as a lead (larger, bolder via `.protocol-body > p:first-child`). Don't paste external text verbatim — rewrite in our voice. Mention close peers when it helps frame the protocol's position.
- **Subcategories**: pick 1–3 from the category's allowed list in `src/data/categories.ts`. Schema rejects unknown values.
- **Tags**: prefer `unknown` over guessing. `audited: unknown` is honest; `audited: true` without evidence is misleading.
- **`other` category**: last resort. If sync produces a flood of `other`, extend `scripts/lib/categorize.ts` (the only place "intelligence" lives in the pipeline).
- **Outbound links**: always go through `withUtm()` and `relForLink(data.link_type)`. UTM is `utm_source=dappdefi.com`. Don't bypass.
- **No external text in production.** Sync writes raw text as a seed — polish before merging to main.

## Schema gotchas

- **No `slug` in `src/content/config.ts` schema.** Astro 5 reserves the frontmatter `slug` field for URL routing — if you put it in the zod schema, every entry fails validation. Use `entry.slug` everywhere instead of `entry.data.slug`.
- **`logo` accepts URL or `/`-rooted path.** The schema in `config.ts`, `write-markdown.ts`, and `write-batch.ts` all use a custom refine to allow self-hosted logos under `/public/logos/`.
- **`listed_at: 2026-04-29`** is the date the entry was added (renamed in UI to "Last Updated"). Don't change it on edits — historical record.
- **`maturity` is computed** by the writer scripts from `tags.launched` + `chains.length`. Don't set it by hand; the script always overrides.

## Deploy and ops

- Repo is **private** at `vinniejames/dappdefi`. The user keeps it private intentionally — don't run `gh repo edit --visibility public` or enable Pages without explicit permission. See `~/.claude/projects/-Users-vince-Sites-dappdefi/memory/feedback_public_actions.md`.
- SSH agent on the user's machine sometimes can't sign — if `git push` over SSH fails, swap remote to HTTPS temporarily: `git remote set-url --push origin https://github.com/vinniejames/dappdefi.git`, push, then restore SSH. `gh auth setup-git` configures the credential helper.
- Site URL `https://dappdefi.com` (set in `astro.config.mjs`); custom-domain CNAME isn't in the repo yet.
- `update.yml` weekly cron only does fetch + diff + open issue. **Never enriches in CI** — that's the no-API-key constraint. A human runs `npm run sync` (or invokes Claude Code) locally.

## Style of work the user prefers

- Concise, technical, no hand-holding. Skip preambles.
- Push code, but **don't make repos public, enable Pages, deploy to public services, or otherwise publish**. The user controls the moment of public release.
- For UI changes, dev server hot-reloads but **Tailwind config changes (new plugins) require a full restart**. Kill and restart if installing typography or similar.
- Per-batch commits during long content runs (the seed used 20 commits, one per batch of 25). Recoverable from `git log`.
- Co-author trailer style: `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`.
