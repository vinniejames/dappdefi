---
name: crvUSD
slug: crvusd
category: lending
subcategories: [cdp]
chains: [Ethereum]
url: https://crvusd.curve.finance
twitter: CurveFinance
github: curvefi/curve-stablecoin
logo: null
listed_at: 2026-04-29
tags:
  governance: dao
  token: CRV
  audited: true
  open_source: true
  custody: non-custodial
  permissions: permissionless
  launched: 2023
  maturity: growing
---

crvUSD is Curve's CDP-style stablecoin pegged to the dollar. Borrowers deposit collateral (initially LSTs and BTC wrappers) and mint crvUSD, but unlike traditional CDPs Curve uses a continuous "soft liquidation" mechanism (LLAMMA) that gradually rebalances the position into stablecoins as the price falls toward the liquidation threshold.

The LLAMMA design absorbs price moves through a Curve-style AMM rather than discrete liquidation events, making borrowing on crvUSD smoother than standard CDPs. CRV holders govern the protocol.
