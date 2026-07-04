// JSON-LD 塞進 <script> 前先跳脫 <，避免內容含 "</script>" 時提早關閉標籤。
export function jsonLdScript(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c')
}
