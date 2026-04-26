export async function subscribeEmail(email: string): Promise<void> {
  const apiKey = process.env.CONVERTKIT_API_KEY
  const formId = process.env.CONVERTKIT_FORM_ID

  if (!apiKey || !formId) {
    throw new Error('Newsletter service is not configured')
  }

  const res = await fetch(
    `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, email }),
    }
  )

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message ?? '訂閱失敗，請稍後再試')
  }
}
