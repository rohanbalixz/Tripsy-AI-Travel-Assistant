"use client";

import { useState } from "react";
import LazyMap from "../components/LeafletMap";

type Msg = { role: "user" | "assistant"; content: string };

export default function Page() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "Hi, I am Tripsy — how can I make you fall in love with our world?" }
  ]);
  const [input, setInput] = useState("");

  async function send() {
    const text = input.trim();
    if (!text) return;
    setMsgs(m => [...m, { role: "user", content: text }]);
    setInput("");
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json().catch(() => ({}));
      const answer = (data && data.answer) || "Hmm, something went wrong. Try again?";
      setMsgs(m => [...m, { role: "assistant", content: answer }]);
    } catch {
      setMsgs(m => [...m, { role: "assistant", content: "Network hiccup. Try again?" }]);
    }
  }

  return (
    <main style={{
      minHeight: "100dvh",
      background: "#0b0f12",
      color: "#e5fbea",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
    }}>
      <div style={{ textAlign: "center", padding: "12px 0", color: "#6df58e" }}>
        <strong>Tripsy</strong> <span style={{ color: "#9fc8a6" }}>Travel planning that feels like magic.</span>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "16px"
      }}>
        {/* Left: Chat */}
        <section style={{
          background: "#0f1519",
          border: "1px solid #183024",
          borderRadius: "16px",
          padding: "16px",
          minHeight: "78dvh",
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{ flex: 1, overflow: "auto" }}>
            {msgs.map((m, i) => (
              <div key={i} style={{
                background: m.role === "assistant" ? "#0b1a14" : "#121a22",
                border: "1px solid #183024",
                color: "#cfeee0",
                padding: "12px 14px",
                borderRadius: "12px",
                marginBottom: "10px",
                maxWidth: "92%"
              }}>
                {m.content}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Tell me a place, vibe, dates…"
              style={{
                flex: 1,
                background: "#0b1115",
                color: "#d8f7e9",
                border: "1px solid #183024",
                borderRadius: "12px",
                padding: "12px 14px",
                outline: "none"
              }}
            />
            <button onClick={send} style={{
              background: "#22c55e",
              color: "#041008",
              border: "none",
              borderRadius: "12px",
              padding: "0 16px",
              fontWeight: 700,
              cursor: "pointer"
            }}>Send</button>
          </div>
        </section>

        {/* Right: Travel Essentials (top) + Map (bottom) */}
        <section style={{ display: "grid", gridTemplateRows: "auto 1fr", gap: "12px", minHeight: "78dvh" }}>
          <div style={{
            background: "#0f1519",
            border: "1px solid #183024",
            borderRadius: "16px",
            padding: "16px"
          }}>
            <div style={{ color: "#6df58e", fontWeight: 700, marginBottom: "6px" }}>Travel Essentials</div>
            <ul style={{ margin: 0, paddingLeft: "18px", color: "#cfeee0", lineHeight: 1.6 }}>
              <li>Ask about a place to see essentials.</li>
              <li>Best season &amp; weather</li>
              <li>Flight &amp; stay ideas (soon)</li>
              <li>Local highlights &amp; safety tips</li>
            </ul>
          </div>

          <div style={{
            background: "#0f1519",
            border: "1px solid #183024",
            borderRadius: "16px",
            overflow: "hidden"
          }}>
            <LazyMap center={[28.6139, 77.209]} label="New Delhi" />
          </div>
        </section>
      </div>
    </main>
  );
}
