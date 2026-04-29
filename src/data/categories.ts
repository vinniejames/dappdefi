export type CategorySlug =
  | 'lending'
  | 'dex'
  | 'perps'
  | 'liquid-staking'
  | 'yield'
  | 'bridges'
  | 'stablecoins'
  | 'rwa'
  | 'restaking'
  | 'infrastructure'
  | 'prediction-markets'
  | 'nft-fi'
  | 'gaming'
  | 'social'
  | 'other';

export type Category = {
  slug: CategorySlug;
  name: string;
  description: string;
  subcategories: readonly string[];
};

export const CATEGORIES: readonly Category[] = [
  {
    slug: 'lending',
    name: 'Lending',
    description:
      'On-chain credit markets, money markets, and collateralized debt positions. Users supply assets to earn yield and borrow against deposited collateral.',
    subcategories: [
      'money-market',
      'overcollateralized',
      'undercollateralized',
      'isolated-pools',
      'cdp',
      'fixed-rate',
    ],
  },
  {
    slug: 'dex',
    name: 'Decentralized Exchanges',
    description:
      'Spot trading venues — automated market makers, order books, and aggregators that route swaps across multiple sources.',
    subcategories: [
      'amm',
      'clmm',
      'orderbook',
      'aggregator',
      'stableswap',
      'intent-based',
    ],
  },
  {
    slug: 'perps',
    name: 'Perpetuals & Derivatives',
    description:
      'Perpetual futures, options, and synthetic derivatives. Leveraged exposure to crypto and other assets without expiry.',
    subcategories: ['orderbook', 'vamm', 'synthetic', 'options'],
  },
  {
    slug: 'liquid-staking',
    name: 'Liquid Staking',
    description:
      'Staked-asset tokens (LSTs) and liquid restaking tokens (LRTs) that keep capital productive while securing networks.',
    subcategories: ['lst', 'lrt', 'native-staking', 'pooled-staking'],
  },
  {
    slug: 'yield',
    name: 'Yield',
    description:
      'Yield aggregators, vaults, and structured products that automate strategies across underlying DeFi protocols.',
    subcategories: ['vault', 'aggregator', 'structured', 'fixed-yield', 'leveraged'],
  },
  {
    slug: 'bridges',
    name: 'Bridges',
    description:
      'Cross-chain asset movement and messaging. Lock-mint, liquidity-pool, and intent-based bridging between networks.',
    subcategories: ['lock-mint', 'liquidity-pool', 'messaging', 'intent-based'],
  },
  {
    slug: 'stablecoins',
    name: 'Stablecoins',
    description:
      'Issuers of dollar-pegged and other stable assets — fiat-backed, crypto-backed, and algorithmic designs.',
    subcategories: ['fiat-backed', 'crypto-backed', 'algorithmic', 'yield-bearing', 'rwa-backed'],
  },
  {
    slug: 'rwa',
    name: 'Real World Assets',
    description:
      'Tokenized off-chain assets — treasuries, credit, commodities, and real estate brought on-chain.',
    subcategories: ['treasuries', 'private-credit', 'commodities', 'real-estate', 'yield-bearing'],
  },
  {
    slug: 'restaking',
    name: 'Restaking',
    description:
      'Platforms that let staked assets secure additional services, including AVS networks and shared security marketplaces.',
    subcategories: ['eth-restaking', 'btc-restaking', 'sol-restaking', 'avs'],
  },
  {
    slug: 'infrastructure',
    name: 'Infrastructure',
    description:
      'Oracles, indexers, MEV infrastructure, account abstraction, and other plumbing the rest of DeFi runs on.',
    subcategories: ['oracle', 'indexer', 'mev', 'account-abstraction', 'rollup', 'data'],
  },
  {
    slug: 'prediction-markets',
    name: 'Prediction Markets',
    description:
      'On-chain venues for trading event outcomes — politics, sports, economic indicators, and beyond.',
    subcategories: ['cpmm', 'orderbook', 'parimutuel'],
  },
  {
    slug: 'nft-fi',
    name: 'NFT Finance',
    description:
      'NFT lending, fractionalization, and other financial primitives built on non-fungible collateral.',
    subcategories: ['nft-lending', 'fractional', 'marketplace', 'royalties'],
  },
  {
    slug: 'gaming',
    name: 'Gaming',
    description:
      'On-chain games and gaming-adjacent finance — autonomous worlds, item markets, and tournament infrastructure.',
    subcategories: ['onchain-game', 'item-market', 'guild'],
  },
  {
    slug: 'social',
    name: 'Social',
    description:
      'Social and creator protocols with financial primitives — tipping, subscriptions, and on-chain identity.',
    subcategories: ['social-graph', 'creator', 'identity', 'tipping'],
  },
  {
    slug: 'other',
    name: 'Other',
    description:
      'Protocols that do not fit cleanly into the canonical categories. This bucket is a last resort.',
    subcategories: [],
  },
] as const;

export const CATEGORY_BY_SLUG: Record<CategorySlug, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
) as Record<CategorySlug, Category>;

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug) as readonly CategorySlug[];

export function isValidSubcategory(category: CategorySlug, sub: string): boolean {
  return CATEGORY_BY_SLUG[category].subcategories.includes(sub);
}
