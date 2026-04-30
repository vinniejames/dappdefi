---
name: "Uniswap V4"
slug: uniswap-v4
category: dex
subcategories: [clmm, amm]
chains: [Ethereum, Arbitrum, Base, Polygon, Unichain]
url: https://app.uniswap.org/
twitter: Uniswap
github: Uniswap/v4-core
logo: /logos/uniswap-v4.png
listed_at: 2025-01-29
tags:
  governance: dao
  token: UNI
  audited: true
  open_source: true
  custody: non-custodial
  permissions: permissionless
  launched: 2025
  maturity: new
---

Uniswap V4 keeps the concentrated-liquidity model of V3 and adds two structural changes: a singleton contract that holds all pools, and a hooks system that lets developers extend pool behavior with custom logic at fixed lifecycle points. The singleton drives gas costs down, and hooks unlock new pool types — limit orders, dynamic fees, on-chain auctions, custom oracles — without forking the core.

V4 is also the substrate for Uniswap Foundation's broader Hooks ecosystem and the Unichain rollup. UNI continues as the governance token across versions.
