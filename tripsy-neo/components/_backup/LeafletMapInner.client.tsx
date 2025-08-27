"use client";
import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Props = { center: [number, number]; zoom?: number; label?: string; className?: string };

export default function LeafletMapInner({ center, zoom = 13, label, className = "" }: Props) {
  // set default marker icons once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default as any;
      if (cancelled) return;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    })();
    return () => { cancelled = true; };
  }, []);

  // unique root marker + remount key when props truly change
  const rootId = useRef(`leaflet-root-${Math.random().toString(36).slice(2)}`);
  const key = useMemo(() => {
    const [lat, lng] = center;
    return `mk-${lat.toFixed(5)}-${lng.toFixed(5)}-${zoom}`;
  }, [center, zoom]);

  // hard cleanup to avoid stale Leaflet instances
  useEffect(() => {
    return () => {
      const el = document.querySelector<HTMLElement>(`[data-leaflet-root="${rootId.current}"]`);
      if (el) el.innerHTML = "";
    };
  }, []);

  return (
    <div className={`h-full w-full ${className}`} data-leaflet-root={rootId.current}>
      <MapContainer key={key} center={center} zoom={zoom} className="h-full w-full"
        style={{ height: "100%", width: "100%" }}>
        <TileLayer url={process.env.NEXT_PUBLIC_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png"} />
        <Marker position={center}><Popup>{label || "Selected location"}</Popup></Marker>
      </MapContainer>
    </div>
  );
}
