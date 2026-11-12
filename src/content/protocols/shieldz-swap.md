---
name: "Shieldz Swap"
slug: shieldz-swap
category: dex
subcategories: [aggregator, intent-based]
chains: [Bitcoin, Ethereum, Solana, Tron, Base, Arbitrum, BNB Chain, Polygon, Avalanche, Zcash]
url: https://swap.shieldz.cash
twitter: shieldzcash
github: ShieldZCash
logo: https://swap.shieldz.cash/icon-512.png
listed_at: 2026-11-12
tags:
  governance: unknown
  token: null
  audited: false
  open_source: false
  custody: non-custodial
  permissions: permissionless
  launched: 2026
  maturity: new
---

Shieldz Swap is a cross-chain swap front end that sits on top of existing routing protocols rather than running its own liquidity. For each quote it asks NEAR Intents, Chainflip, Relay and Maya Protocol at the same moment, then shows every route with the amount received, fees and expected settlement time, so the user picks the route before signing.

Swaps run from the user's own wallet to the chosen protocol and the output is delivered straight to the user's address; Shieldz itself never holds the funds and needs no account. It covers 45 chains including native Bitcoin, Solana, Tron and Zcash, and supports hardware wallets such as Ledger, Trezor and Keystone.

The service charges a flat 0.15% fee that is shown on every quote. Because it depends on the underlying protocols, their risks (delays, refunds, protocol failures) carry over to swaps made through it.
