export async function subscribeEmail(email: string): Promise<void> {
  const webhookUrl = process.env.N8N_SUBSCRIBE_WEBHOOK_URL
  if (!webhookUrl) throw new Error('Newsletter service is not configured')

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  if (!res.ok) {
    throw new Error('訂閱失敗，請稍後再試')
  }
}
