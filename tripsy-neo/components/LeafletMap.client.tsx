"use client";

import { useEffect, useState } from "react";

type Props = {
  center: [number, number];
  label?: string;
  zoom?: number;
  className?: string;
};

export default function LeafletMap({ center, label, zoom = 12, className = "" }: Props) {
  const [ready, setReady] = useState(false);
  const [RL, setRL] = useState<any>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (typeof window === "undefined") return;
      const rl = await import("react-leaflet");
      const leaflet = (await import("leaflet")).default;

      // Use CDN marker icons to avoid 404
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
      });

      setRL(rl);
      setL(leaflet);
      setReady(true);
    })();
  }, []);

  if (!ready || !RL || !L) {
    return <div style={{ height: "100%", width: "100%" }} />;
  }

  const { MapContainer, TileLayer, Marker, Popup } = RL as any;

  return (
    <div className={`h-full w-full ${className}`}>
      <MapContainer center={center} zoom={zoom} className="h-full w-full" style={{ height: "100%", width: "100%" }}>
        <TileLayer url={process.env.NEXT_PUBLIC_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png"} />
        <Marker position={center}>
          <Popup>{label || "Selected location"}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
