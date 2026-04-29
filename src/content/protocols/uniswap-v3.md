---
name: "Uniswap V3"
slug: uniswap-v3
category: dex
subcategories: [clmm, amm]
chains: [Ethereum, Base, Arbitrum, Binance, Polygon, "X Layer"]
url: https://app.uniswap.org/
twitter: Uniswap
github: Uniswap/v3-core
logo: https://example.com/uniswap-v3.png
listed_at: 2022-10-19
tags:
  governance: dao
  token: UNI
  audited: true
  open_source: true
  custody: non-custodial
  permissions: permissionless
  launched: 2021
  maturity: established
sources:
  - external: uniswap-v3
---

## Overview

Uniswap V3 introduced concentrated liquidity to AMMs: liquidity providers choose price ranges within which their capital is active, instead of supplying liquidity uniformly across all prices. The result is dramatically higher capital efficiency for the same dollar of liquidity, at the cost of position management complexity.

V3 became the dominant DEX architecture and is deployed on more than a dozen networks. Each LP position is represented as an NFT with its own range and fee tier, which has spawned a category of automated-rebalancing vaults built on top. UNI governs the broader Uniswap stack.
