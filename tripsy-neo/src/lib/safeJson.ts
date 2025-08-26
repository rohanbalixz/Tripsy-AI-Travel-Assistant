export async function safeJson(res: Response): Promise<any> {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try { return await res.json(); } catch {}
  }
  try {
    const txt = await res.text();
    try { return JSON.parse(txt); } catch {
      return { error: true, message: txt || "Non-JSON response" };
    }
  } catch (e: any) {
    return { error: true, message: e?.message || "Unknown parse error" };
  }
}
