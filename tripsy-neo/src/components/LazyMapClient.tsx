"use client";

import { useEffect } from "react";
import L from "leaflet";
// real imports only on client
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  center?: [number, number];
  label?: string;
  className?: string;
  tileUrl?: string;
};

export default function LazyMapClient({
  center = [28.6139, 77.2090], // New Delhi default
  label = "New Delhi",
  className = "",
  tileUrl = process.env.NEXT_PUBLIC_TILE_URL || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
}: Props) {
  // Fix default marker assets
  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      iconUrl: "/leaflet/marker-icon.png",
      shadowUrl: "/leaflet/marker-shadow.png",
    });
  }, []);

  return (
    <div className={`h-full w-full overflow-hidden rounded-2xl ${className}`}>
      <MapContainer center={center} zoom={11} className="h-full w-full">
        <TileLayer url={tileUrl} attribution='&copy; OpenStreetMap contributors' />
        <Marker position={center}>
          <Popup>{label}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
