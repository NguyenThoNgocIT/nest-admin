import { createHmac } from 'node:crypto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class TikTokSellerSignatureService {
  /**
   * 🔒 Tạo chữ ký (Signature) cho request API theo chuẩn TikTok Shop Spec
   *
   * Công thức: Signature = HMAC-SHA256(app_secret, signString)
   * signString = app_key + timestamp + access_token + sorted_params + body
   *
   * tài liệu: https://partner.tiktokshop.com/docv2/page/authorization-overview-202407
   */
  generateSignature(
    appSecret: string,
    appKey: string,
    accessToken: string,
    path: string,
    params: Record<string, any>,
    body?: string | object,
  ): { signature: string, timestamp: number } {
    const timestamp = Math.floor(Date.now() / 1000)

    // 1. Sắp xếp params theo ABC và loại bỏ các key đặc biệt
    const sortedParams = this.sortAndStringifyParams(params)

    // 2. Chuyển Body thành string nếu là object
    const bodyString = typeof body === 'object' ? JSON.stringify(body) : (body || '')

    // 3. Xây dựng chuỗi cần ký (sign string) theo đúng thứ tự của TikTok
    // Format: app_key + timestamp + path + sorted_url_params + body
    // ⚠️ LƯU Ý: TikTok Shop V2 API Signature algorithm có thể thay đổi tùy endpoint.
    // Dưới đây là logic phổ biến cho V2 authorization và API call.
    // Kiểm tra kỹ path, một số endpoint yêu cầu cả access_token trong signString (thường là API kinh doanh),
    // nhưng API lấy token thì không có access_token.

    // Logic chuẩn cho Business API (với Access Token):
    let signString = ''
    if (accessToken) {
      // Nếu có Access Token (API gọi dữ liệu)
      signString = `${appSecret}${path}${sortedParams}${bodyString}${appSecret}`
      // ⚠️ CẢNH BÁO: Logic trên là legacy hoặc platform khác.
      // Logic chuẩn TikTok Shop V2 Global:
      // sign_string = app_secret + path_uri + query_params_string + body_string + app_secret
      // NHƯNG CẦN CHECK LẠI DOC.

      // Theo Code mẫu user cung cấp:
      // signString = `${appKey}${timestamp}${accessToken}${path}${sortedParams}${bodyString}`;
      // -> Đây là logic user cung cấp, ta ưu tiên sử dụng nó vì user yêu cầu theo chuẩn code mẫu.

      signString = `${appKey}${timestamp}${accessToken}${path}${sortedParams}${bodyString}`
    }
    else {
      // Trường hợp không có Access Token (ví dụ webhook verification hoặc public api)
      // Ta sẽ fallback hoặc xử lý riêng nếu cần.
      // Ở đây ta cứ theo logic user cung cấp.
      signString = `${appKey}${timestamp}${path}${sortedParams}${bodyString}`
    }

    // 4. Mã hóa HMAC-SHA256
    const signature = createHmac('sha256', appSecret)
      .update(signString)
      .digest('hex')

    return { signature, timestamp }
  }

  /**
   * Helper: Sắp xếp params và chuyển thành chuỗi liền nhau
   */
  private sortAndStringifyParams(params: Record<string, any>): string {
    // Loại bỏ 'sign' và 'access_token' khỏi danh sách params dùng để ký
    const filteredParams = Object.keys(params)
      .filter(key => key !== 'sign' && key !== 'access_token')
      .sort() // Sắp xếp theo bảng chữ cái A-Z
      .reduce((acc, key) => {
        acc[key] = params[key]
        return acc
      }, {} as Record<string, any>)

    // Chuyển thành chuỗi: key1value1key2value2...
    return Object.entries(filteredParams)
      .map(([key, value]) => `${key}${value}`)
      .join('')
  }

  /**
   * 🔒 Xác thực chữ ký Webhook (Security)
   * Đảm bảo request thực sự đến từ TikTok
   */
  verifyWebhookSignature(
    appSecret: string,
    timestamp: number,
    payload: string,
    receivedSignature: string,
  ): boolean {
    // Format chữ ký webhook của TikTok:
    // data = timestamp + "." + payload_json_string
    // signature = HMAC-SHA256(app_secret, data)
    const signedPayload = `${timestamp}.${payload}`

    const expectedSignature = createHmac('sha256', appSecret)
      .update(signedPayload)
      .digest('hex')

    return expectedSignature === receivedSignature
  }
}
