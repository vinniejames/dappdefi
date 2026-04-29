---
name: "Hyperliquid Bridge"
slug: hyperliquid-bridge
category: bridges
subcategories: [lock-mint, messaging]
chains: [Arbitrum, "Hyperliquid L1"]
url: https://app.hyperliquid.xyz
twitter: HyperliquidX
github: null
logo: null
listed_at: 2024-04-15
tags:
  governance: foundation
  token: HYPE
  audited: true
  open_source: false
  custody: non-custodial
  permissions: permissionless
  launched: 2024
  maturity: growing
---

Hyperliquid Bridge is the canonical entry and exit point between Arbitrum and the Hyperliquid L1, the perpetual-futures appchain. USDC is the primary asset that flows across, with native USDC minted on Hyperliquid via Circle's CCTP and bridged from Arbitrum into the L1 for trading.

The bridge is a key piece of Hyperliquid's value capture: most of the USDC backing the perps and spot order books on Hyperliquid is held in the bridge contract, secured by the Hyperliquid validator set. Withdrawals back to Arbitrum are signed by validators after a fraud-proof window.
