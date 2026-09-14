---
name: "TRDEFI"
slug: trdefi
category: yield
subcategories: [aggregator]
chains: [Base, Ethereum, Arbitrum, Optimism, Polygon]
url: https://app.trdefi.com
twitter: trdefi
github: trdefi
logo: null
listed_at: 2026-09-14
tags:
  governance: foundation
  token: null
  audited: unknown
  open_source: false
  custody: non-custodial
  permissions: permissionless
  launched: 2025
---

TRDEFI is a non-custodial yield app built on the 1inch Aqua shared liquidity layer. Liquidity providers open a maker strategy on an active Aqua pair without moving funds: capital stays in the wallet and is only committed through a revocable ERC-20 allowance. A maker sets a commission (0-20%) and a fee receiver, then signs approve + ship to open the position on-chain.

When a taker swaps against the order, the maker's commission is charged inside the swap and settled to the fee receiver; there is no pool deposit and no lock-up. Makers exit with a single dock + approve(0) transaction. TRDEFI currently supports Base, Ethereum, Arbitrum, Optimism and Polygon, and targets treasury use cases such as crypto treasuries, fintechs and iGaming platforms holding idle stablecoin floats.

TRDEFI does not guarantee yield: earnings depend on real taker volume against the order and are subject to smart-contract and market risk.
