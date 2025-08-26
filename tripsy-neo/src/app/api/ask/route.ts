export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  const { message, history = [] } = await req.json();
  const response = await fetch(`${process.env.TRIPSY_BACKEND_URL || "http://127.0.0.1:8012"}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  // If backend fails, return graceful JSON so UI doesn't crash
  if (!response.ok) {
    return Response.json({ answer: "Server is thinking too hard. Try again in a moment." }, { status: 200 });
  }
  const data = await response.json();
  return Response.json(data);
}
