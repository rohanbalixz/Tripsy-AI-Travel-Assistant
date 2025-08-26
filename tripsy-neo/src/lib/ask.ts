export async function ask(message: string): Promise<string> {
  const r = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  })
  if (!r.ok) {
    const e = await r.json().catch(() => ({}))
    throw new Error(e?.error || `HTTP ${r.status}`)
  }
  const data = await r.json()
  return data.answer || ""
}
