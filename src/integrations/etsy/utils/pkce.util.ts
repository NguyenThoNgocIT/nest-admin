import * as crypto from 'node:crypto'

/**
 * Tạo một chuỗi ngẫu nhiên (dùng cho code_verifier và state)
 */
export function generateRandomString(length = 96): string {
  return crypto.randomBytes(length).toString('base64url').substring(0, 128)
}

/**
 * Tạo code_challenge từ code_verifier bằng thuật toán SHA-256
 * @param codeVerifier Chuỗi ngẫu nhiên gốc
 */
export function generateCodeChallenge(codeVerifier: string): string {
  return crypto.createHash('sha256').update(codeVerifier).digest('base64url')
}
