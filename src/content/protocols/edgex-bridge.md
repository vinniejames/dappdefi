---
name: "edgeX Bridge"
slug: edgex-bridge
category: bridges
subcategories: [lock-mint]
chains: [Ethereum, "edgeX L1", Arbitrum, Binance]
url: https://edgex.exchange
twitter: edgeX_exchange
github: null
logo: https://example.com/edgex-bridge.jpg
listed_at: 2026-04-29
tags:
  governance: foundation
  token: EDGE
  audited: unknown
  open_source: false
  custody: non-custodial
  permissions: permissionless
  launched: 2024
  maturity: growing
sources:
  - external: edgex-bridge
---

edgeX Bridge is the deposit and withdrawal layer for edgeX, an orderbook-based perpetual DEX with its own L1 settlement layer. Users bridge USDC and other supported assets in to trade on edgeX's order book, where matching happens with native (non-AMM) trading-engine semantics.

Like other appchain perp venues, the bridge contracts hold the bulk of trader collateral. EDGE is the platform's token.
