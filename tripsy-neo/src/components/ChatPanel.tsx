"use client";

import { useEffect, useRef, useState } from "react";
type Msg = { role: "user" | "assistant"; content: string };

export default function ChatPanel({ onPlace }: { onPlace?: (p: string) => void }) {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi, I am Tripsy — how can I make you fall in love with our world?" },
  ]);
  const [input, setInput] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
    const last = messages[messages.length - 1]?.content?.toLowerCase() || "";
    const m = last.match(/\b(?:in|to|at|around)\s+([a-zA-Z\s,.'-]{3,})$/);
    if (m && m[1] && onPlace) onPlace(m[1].trim());
  }, [messages, onPlace]);

  async function send() {
    const text = input.trim();
    if (!text) return;
    const history = [...messages, { role: "user", content: text }];
    setMessages(history);
    setInput("");

    let data: any = null;
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      data = await res.json();
    } catch {
      data = { answer: "Sorry—backend error." };
    }
    const reply = (data?.answer ?? "").toString();
    setMessages((m) => [...m, { role: "assistant", content: reply }]);
  }

  return (
    <div className="h-full flex flex-col">
      <div ref={scroller} className="chat-scroll">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`${m.role === "assistant" ? "bg-emerald-900/20 border-emerald-800/40" : "bg-zinc-800/20 border-zinc-700/30"} border rounded-xl px-3 py-2 text-sm`}
          >
            {m.content}
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Tell me a place, vibe, dates…"
          className="tripsy-input"
        />
        <button onClick={send} className="tripsy-btn">Send</button>
      </div>
    </div>
  );
}
