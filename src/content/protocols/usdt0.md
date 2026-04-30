---
name: USDT0
slug: usdt0
category: bridges
subcategories: [messaging, lock-mint]
chains: [Ethereum]
url: https://usdt0.to
twitter: USDT0_to
github: null
logo: /logos/usdt0.jpg
listed_at: 2025-03-13
tags:
  governance: foundation
  token: null
  audited: true
  open_source: false
  custody: custodial
  permissions: permissioned
  launched: 2025
  maturity: new
---

USDT0 is the omnichain interoperability layer for Tether's USDT, built on the LayerZero messaging stack. It offers a single canonical USDT representation that can be moved natively between supported chains without going through wrapped-token detours.

Under the hood USDT0 uses LayerZero's OFT (Omnichain Fungible Token) standard, where each chain holds a paired contract and supply is reconciled through cross-chain messages. The result is a unified UX for Tether across networks, with the trust assumption inherited from LayerZero's verification and execution stack.
