export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { message, history = [] } = await req.json();
  const url = process.env.TRIPSY_BACKEND_URL || "http://127.0.0.1:8012";

  try {
    const r = await fetch(`${url}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history })
    });
    if (!r.ok) {
      const text = await r.text();
      return new Response(JSON.stringify({ answer: `Backend error: ${text}` }), { status: 200 });
    }
    const data = await r.json();
    return Response.json(data);
  } catch (e: any) {
    return Response.json({ answer: "Cannot reach Tripsy backend right now." });
  }
}
