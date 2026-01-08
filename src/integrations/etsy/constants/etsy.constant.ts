export const ETSY_API_URL = 'https://api.etsy.com/v3'
export const ETSY_AUTH_URL = 'https://www.etsy.com/oauth/connect'
export const ETSY_TOKEN_URL = 'https://api.etsy.com/v3/public/oauth/token'

// Prefix cho Redis key lưu state
export const ETSY_OAUTH_STATE_PREFIX = 'etsy:oauth:state:'

// TTL cho state (10 phút)
export const ETSY_OAUTH_STATE_TTL = 600

export const ETSY_SCOPES = [
  'listings_r',
  'listings_w',
  'shops_r',
  'shops_w',
  'transactions_r',
  'profile_r',
  'email_r',
].join(' ')
