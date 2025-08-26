"use client";

import LeafletMap from "./LeafletMap.client";

export default function RightPane() {
  return (
    <section style={{ display: "grid", gridTemplateRows: "auto 1fr", gap: 12, minHeight: "78dvh" }}>
      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 16,
          padding: 16
        }}
      >
        <div style={{ color: "var(--accent)", fontWeight: 700, marginBottom: 6 }}>Travel Essentials</div>
        <ul style={{ margin: 0, paddingLeft: 18, color: "var(--ink)", lineHeight: 1.6 }}>
          <li>Ask about a place to see essentials.</li>
          <li>Best season &amp; weather</li>
          <li>Flight &amp; stay ideas (soon)</li>
          <li>Local highlights &amp; safety tips</li>
        </ul>
      </div>

      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 16,
          overflow: "hidden"
        }}
      >
        <LeafletMap center={[28.6139, 77.209]} label="New Delhi" />
      </div>
    </section>
  );
}
