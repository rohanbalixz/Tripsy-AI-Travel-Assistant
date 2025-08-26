"use client";

import { useState } from "react";

export default function PlanPage() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  async function handleAsk() {
    if (!input) return;
    setResponse("...");
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setResponse(data.reply || JSON.stringify(data));
    } catch (err) {
      setResponse("Error: " + (err as Error).message);
    }
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Plan Your Trip ✈️</h1>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Tripsy (e.g. 3-day Tokyo trip)"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleAsk}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Ask
        </button>
      </div>
      <pre className="bg-muted p-4 rounded">{response}</pre>
    </main>
  );
}
