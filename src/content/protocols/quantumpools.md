---
name: QuantumPools
slug: quantumpools
category: yield
subcategories: [vault]
chains: ["Robinhood Chain", Base, "BNB Smart Chain"]
url: https://quantumpools.io
twitter: QuantumPools
github: Kittrian/quantumpools-public
logo: /logos/quantumpools.png
listed_at: 2026-10-21
tags:
  governance: multisig
  token: null
  audited: unknown
  open_source: unknown
  custody: non-custodial
  permissions: permissionless
  launched: 2026
  maturity: new
---

QuantumPools runs self-withdrawable managed Uniswap V3 and PancakeSwap V3 LP vaults. Each depositor keeps their own position, which is snuggled (automatically rebalanced) to stay in range, with fees compounded.

A deposit is recorded to that wallet as its own concentrated-liquidity position rather than mixed into a shared pool. When price drifts, a keeper snuggles the range so the position stays active, and the trading fees collected along the way are compounded back in. The depositor can withdraw at any time.

Vaults are live on Robinhood Chain, Base, and BNB Smart Chain. Admin actions sit behind a 48-hour timelock owned by a Safe. The per-wallet position is the distinction from pooled liquidity managers such as Steer Protocol, where many depositors share a single range.
