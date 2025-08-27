export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { message, history = [], session_id = "web-ui" } = await req.json();

    const resp = await fetch(`${process.env.NEXT_PUBLIC_TRIPSY_API || "http://127.0.0.1:8012"}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history, session_id }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      return new Response(JSON.stringify({ answer: `Upstream error: ${txt}` }), {
        status: 500, headers: { "Content-Type": "application/json" }
      });
    }

    const data = await resp.json();
    return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ answer: `Proxy exception: ${e?.message || e}` }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }
}
