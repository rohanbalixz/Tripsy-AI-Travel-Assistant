"use client";

export default function InfoDock({
  place,
  center,
  notes,
}: {
  place: string | null;
  center: { lat: number; lng: number } | null;
  notes?: string[];
}) {
  const hasPlace = !!place && !!center;
  return (
    <aside
      style={{
        height: "100%",
        borderRadius: 12,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        background: "rgba(12,14,16,0.8)",
        border: "1px solid rgba(0,255,140,0.2)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div style={{ fontWeight: 700, color: "#00ff8c" }}>
        Travel Essentials {hasPlace ? `— ${place}` : ""}
      </div>

      <div style={{ padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.03)" }}>
        <div style={{ opacity: 0.8, marginBottom: 6 }}>Flights (beta)</div>
        <div style={{ fontSize: 13, opacity: 0.75 }}>
          Plug in a free provider later (e.g., Skyscanner Partners, Kiwi Tequila).  
          For now, we’ll show quick links:
        </div>
        {hasPlace ? (
          <ul style={{ marginTop: 8, lineHeight: 1.6 }}>
            <li><a target="_blank" href={`https://www.google.com/travel/flights?q=${encodeURIComponent(place!)}`} rel="noreferrer">Search flights to {place}</a></li>
            <li><a target="_blank" href={`https://www.kayak.com/flights#/${encodeURIComponent(place!)}`} rel="noreferrer">Kayak quick search</a></li>
          </ul>
        ) : (
          <div style={{ opacity: 0.6 }}>Pick a location to unlock flight links.</div>
        )}
      </div>

      <div style={{ padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.03)" }}>
        <div style={{ opacity: 0.8, marginBottom: 6 }}>Stays (beta)</div>
        {hasPlace ? (
          <ul style={{ marginTop: 8, lineHeight: 1.6 }}>
            <li><a target="_blank" href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(place!)}`} rel="noreferrer">Booking.com for {place}</a></li>
            <li><a target="_blank" href={`https://www.google.com/travel/hotels/${encodeURIComponent(place!)}`} rel="noreferrer">Google Hotels</a></li>
          </ul>
        ) : (
          <div style={{ opacity: 0.6 }}>Pick a location to unlock stays.</div>
        )}
      </div>

      <div style={{ padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.03)" }}>
        <div style={{ opacity: 0.8, marginBottom: 6 }}>What I considered</div>
        <ul style={{ marginTop: 8, lineHeight: 1.6 }}>
          {(notes || ["Seasonality", "Travel time", "Budget cues", "Iconic spots"]).map((n, i) => (
            <li key={i} style={{ fontSize: 13, opacity: 0.8 }}>• {n}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
