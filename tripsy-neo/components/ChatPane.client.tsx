"use client";

import { useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatPane() {
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
    <section
      style={{
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: 16,
        padding: 16,
        minHeight: "78dvh",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div style={{ flex: 1, overflow: "auto" }}>
        {msgs.map((m, i) => (
          <div
            key={i}
            style={{
              background: m.role === "assistant" ? "#0b1a14" : "#121a22",
              border: "1px solid var(--line)",
              color: "var(--ink)",
              padding: "12px 14px",
              borderRadius: 12,
              marginBottom: 10,
              maxWidth: "92%"
            }}
          >
            {m.content}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Tell me a place, vibe, dates…"
          style={{
            flex: 1,
            background: "#0b1115",
            color: "#d8f7e9",
            border: "1px solid var(--line)",
            borderRadius: 12,
            padding: "12px 14px",
            outline: "none"
          }}
        />
        <button
          onClick={send}
          style={{
            background: "var(--accent-solid)",
            color: "#041008",
            border: "none",
            borderRadius: 12,
            padding: "0 16px",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>
    </section>
  );
}
