"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  center: [number, number];
  zoom?: number;
  label?: string;
  className?: string;
};

// CDN icons (avoid local 404s)
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function LeafletMap({ center, zoom = 12, label, className = "" }: Props) {
  const mapRef = useRef<L.Map | null>(null);

  // Key forces a brand-new MapContainer when center changes (prevents "already initialized")
  const mapKey = useMemo(() => `${center[0].toFixed(5)}_${center[1].toFixed(5)}_${zoom}`, [center, zoom]);

  // Cleanup on unmount (in case Fast Refresh doesn't fully unmount)
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`h-full w-full ${className}`}>
      <MapContainer
        key={mapKey}
        center={center}
        zoom={zoom}
        className="h-full w-full"
        style={{ height: "100%", width: "100%" }}
        whenCreated={(m) => {
          // Remove any leftover map instance just in case
          if (mapRef.current && mapRef.current !== m) {
            try { mapRef.current.remove(); } catch {}
          }
          mapRef.current = m;
        }}
      >
        <TileLayer url={process.env.NEXT_PUBLIC_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png"} />
        <Marker position={center}>
          <Popup>{label || "Selected location"}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
