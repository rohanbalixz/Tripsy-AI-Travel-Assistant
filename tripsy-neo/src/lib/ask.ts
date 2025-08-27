export async function askTripsy(message: string, history: Array<{role:"user"|"assistant",content:string}> = [], session_id = "web-ui") {
  const r = await fetch("/api/ask", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ message, history, session_id })
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const j = await r.json();
  return j.answer as string;
}
