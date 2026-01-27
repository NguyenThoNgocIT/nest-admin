// src/integrations/tiktok-seller/constants/tiktok-seller.constant.ts

export const TIKTOK_SELLER_CONFIG = {
  // ⚠️ CRITICAL: Authorization URLs (cập nhật theo doc chính thức)
  // Có 2 endpoint khác nhau tùy region/setup:

  // Option 1: services.tiktokshop.com (Global - khuyến nghị)
  AUTH_URL: 'https://services.tiktokshop.com/open/authorize',

  // Option 2: auth.tiktok-shops.com (Alternative)
  // AUTH_URL: 'https://auth.tiktok-shops.com/oauth/authorize',

  // Token endpoints (Global API)
  TOKEN_URL: 'https://auth.tiktok-shops.com/api/v2/token/get',
  TOKEN_REFRESH_URL: 'https://auth.tiktok-shops.com/api/v2/token/refresh',

  // API Base URL (global - phục vụ tất cả regions)
  API_BASE: 'https://open-api.tiktokglobalshop.com',

  // API Version (khuyến nghị dùng mới nhất)
  API_VERSION: '202309', // Hoặc 202312, 202405 tùy doc

  // Token lifetimes (CHÍNH XÁC theo doc)
  ACCESS_TOKEN_EXPIRY: 604800, // 7 days = 7 * 24 * 60 * 60
  // Refresh token: vô hạn (nhưng có thể bị revoke)

  // OAuth session
  STATE_TTL: 600, // 10 minutes

  // Grant types
  GRANT_TYPE: {
    AUTHORIZED_CODE: 'authorized_code',
    REFRESH_TOKEN: 'refresh_token',
  },
} as const

export const TIKTOK_SELLER_REGIONS = {
  US: 'US',
  UK: 'UK',
  ID: 'ID', // Indonesia
  TH: 'TH', // Thailand
  VN: 'VN', // Vietnam
  PH: 'PH', // Philippines
  MY: 'MY', // Malaysia
  SG: 'SG', // Singapore
} as const

export const TIKTOK_SELLER_ORDER_STATUS = {
  UNPAID: 100,
  AWAITING_SHIPMENT: 111,
  AWAITING_COLLECTION: 112,
  IN_TRANSIT: 114,
  DELIVERED: 122,
  COMPLETED: 130,
  CANCELLED: 140,
} as const

export const TIKTOK_SELLER_WEBHOOK_EVENTS = {
  ORDER_STATUS_CHANGE: 1,
  REVERSE_ORDER_STATUS_CHANGE: 2,
  PRODUCT_STATUS_CHANGE: 3,
  PACKAGE_UPDATE: 4,
  PRODUCT_INFO_CHANGE: 5,
  SHOP_AUTHORIZED: 9,
  SHOP_DEAUTHORIZED: 10,
} as const

// ⚠️ NOTE:
// 1. Scopes KHÔNG request trong OAuth URL - config trong Partner Center
// 2. App_id = App Key từ Partner Center
// 3. Redirect URI phải ĐÚNG 100% với Partner Center config
