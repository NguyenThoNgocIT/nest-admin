// src/integrations/ebay/constants/ebay.constant.ts

interface EbayConfig {
  [key: string]: {
    AUTH_URL: string
    TOKEN_URL: string
    API_BASE: string
  }
}

export const EBAY_CONFIG: EbayConfig = {
  // Sandbox
  SANDBOX: {
    AUTH_URL: 'https://auth.sandbox.ebay.com/oauth2/authorize',
    TOKEN_URL: 'https://api.sandbox.ebay.com/identity/v1/oauth2/token',
    API_BASE: 'https://api.sandbox.ebay.com',
  },
  // Production
  PRODUCTION: {
    AUTH_URL: 'https://auth.ebay.com/oauth2/authorize',
    TOKEN_URL: 'https://api.ebay.com/identity/v1/oauth2/token',
    API_BASE: 'https://api.ebay.com',
  },
}

export const EBAY_SCOPES = [
  'https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly',
  'https://api.ebay.com/oauth/api_scope/sell.inventory.readonly',
  'https://api.ebay.com/oauth/api_scope/commerce.identity.readonly', // Để lấy User Info
]

// Token lifetimes
export const EBAY_ACCESS_TOKEN_EXPIRY = 7200 // 2 hours
export const EBAY_REFRESH_TOKEN_EXPIRY = 47304000 // ~18 months

// OAuth session TTL
export const EBAY_STATE_TTL = 10 * 60 * 1000 // 10 minutes (in milliseconds)

// Redis Key Prefix
export const EBAY_OAUTH_STATE_PREFIX = 'ebay:oauth:state:'

export const EBAY_MARKETPLACES = {
  EBAY_US: 'EBAY_US',
  EBAY_UK: 'EBAY_UK',
  EBAY_DE: 'EBAY_DE',
  EBAY_AU: 'EBAY_AU',
  // ... thêm marketplace khác
} as const
