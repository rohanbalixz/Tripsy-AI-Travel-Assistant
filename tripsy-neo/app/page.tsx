import ChatPane from "../components/ChatPane.client";
import RightPane from "../components/RightPane.client";

export default function Page() {
  return (
    <main style={{ minHeight: "100dvh" }}>
      <div style={{ textAlign: "center", padding: "12px 0", color: "var(--accent)" }}>
        <strong>Tripsy</strong> <span style={{ color: "#9fc8a6" }}>Travel planning that feels like magic.</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "16px"
        }}
      >
        <ChatPane />
        <RightPane />
      </div>
    </main>
  );
}
