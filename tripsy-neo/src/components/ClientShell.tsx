"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import LazyMap from "./LazyMap";

type Msg = { role: "user" | "assistant"; content: string };

export default function ClientShell() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "Hi, I am Tripsy — how can I make you fall in love with our world?" },
  ]);
  const [input, setInput] = useState("");
  const [place, setPlace] = useState<string>("Boston, MA");
  const [center, setCenter] = useState<[number, number] | undefined>([42.3601, -71.0589]);

  // very simple geocode placeholder (kept client-side for demo)
  async function geocode(q: string): Promise<[number, number] | null> {
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`);
      const j = await r.json();
      if (Array.isArray(j) && j[0]?.lat && j[0]?.lon) {
        return [parseFloat(j[0].lat), parseFloat(j[0].lon)];
      }
    } catch {}
    return null;
  }

  const sending = useRef(false);

  async function send() {
    const text = input.trim();
    if (!text || sending.current) return;
    sending.current = true;
    setInput("");
    setMsgs(m => [...m, { role: "user", content: text }]);

    // naive location extraction: if user says "show X" or "go to X", try geocode
    const wantMap = /(show|map|go to|take me to)\s+(.+)/i.exec(text);
    if (wantMap?.[2]) {
      const q = wantMap[2].trim();
      setPlace(q);
      const coords = await geocode(q);
      if (coords) setCenter(coords);
    }

    // call your backend
    const history = msgs.concat({ role: "user", content: text });
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, history }),
    }).catch(() => null);

    if (!res || !res.ok) {
      setMsgs(m => [...m, { role: "assistant", content: "Sorry—my brain hiccuped. Try again in a sec." }]);
      sending.current = false;
      return;
    }
    const data = await res.json().catch(() => ({ answer: "Sorry—couldn’t parse that response." }));
    setMsgs(m => [...m, { role: "assistant", content: data.answer || "…" }]);
    sending.current = false;
  }

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Left: Chat */}
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 backdrop-blur p-4 flex flex-col min-h-[70dvh]">
          <div className="text-xl font-semibold text-emerald-400">Tripsy</div>
          <div className="mt-2 text-sm text-neutral-400">Travel planning that feels like magic—private, fast &amp; free.</div>
          <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-2">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <div className={`inline-block rounded-xl px-3 py-2 ${m.role === "user" ? "bg-emerald-600/20 border border-emerald-500/30" : "bg-neutral-800/60 border border-neutral-700"}`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              className="flex-1 rounded-xl bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:border-emerald-500"
              placeholder="Ask anything… (try: show Chandigarh on map)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" ? send() : null}
            />
            <button
              onClick={send}
              className="rounded-xl bg-emerald-500 px-4 py-2 font-medium text-black hover:bg-emerald-400"
            >
              Send
            </button>
          </div>
        </section>

        {/* Right: Travel Essentials + Map */}
        <section className="flex flex-col gap-4 min-h-[70dvh]">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 backdrop-blur p-4">
            <div className="text-lg font-semibold text-emerald-400">Travel Essentials</div>
            <div className="mt-2 text-sm text-neutral-300">
              <div><span className="text-neutral-500">Place:</span> {place}</div>
              <div><span className="text-neutral-500">Tip:</span> Type “show &lt;city&gt;” in chat to reposition map.</div>
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 backdrop-blur p-2 flex-1 min-h-[40dvh]">
            <LazyMap place={place} center={center} />
          </div>
        </section>
      </div>
    </main>
  );
}
