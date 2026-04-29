---
name: "Balancer V3"
slug: balancer-v3
category: dex
subcategories: [amm, stableswap]
chains: [Ethereum, Monad, Arbitrum]
url: https://balancer.fi
twitter: Balancer
github: balancer/balancer-v3-monorepo
logo: https://example.com/balancer-v3.jpg
listed_at: 2026-04-29
tags:
  governance: dao
  token: BAL
  audited: true
  open_source: true
  custody: non-custodial
  permissions: permissionless
  launched: 2024
  maturity: growing
sources:
  - external: balancer-v3
---

Balancer V3 is the third major version of Balancer, an AMM with a vault-based architecture and arbitrary-weight pools. V3 simplifies the pool model relative to V2 while keeping support for custom pool types and dynamic fee logic via hooks.

The vault holds all pool tokens; pools themselves are thin contracts that define the swap math. This separation lets new pool types ship as small, audited add-ons rather than full forks. BAL is the governance token, with veBAL controlling gauge emissions.
