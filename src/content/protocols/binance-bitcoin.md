---
name: "Binance Bitcoin"
slug: binance-bitcoin
category: bridges
subcategories: [lock-mint]
chains: [Bitcoin]
url: https://www.binance.com/en/collateral-btokens
twitter: binance
github: null
logo: https://example.com/binance-bitcoin.jpg
listed_at: 2024-08-22
tags:
  governance: foundation
  token: null
  audited: unknown
  open_source: false
  custody: custodial
  permissions: permissioned
  launched: 2020
  maturity: growing
sources:
  - external: binance-bitcoin
---

Binance Bitcoin (BTCB and the broader bToken family) is Binance's pegged-token program, in which the exchange issues on-chain representations of Bitcoin and other assets backed one-for-one by reserves it holds. BTCB is the most prominent of these and circulates broadly on BNB Chain.

Like other custodial wrappers, the design trades the trust assumptions of a decentralized bridge for the operational and regulatory surface of the issuing exchange. Reserves are published periodically, and minting and redemption happen through Binance rather than via on-chain proofs.
