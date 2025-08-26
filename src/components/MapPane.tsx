"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

type Props = {
  center: { lat: number; lng: number } | null;
  label?: string;
};

// Fix default marker icons in Leaflet + Next
const icon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -28],
  shadowSize: [41, 41],
});

function FlyTo({ center }: { center: Props["center"] }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo([center.lat, center.lng], Math.max(map.getZoom(), 10), { duration: 0.8 });
  }, [center, map]);
  return null;
}

export default function MapPane({ center, label }: Props) {
  const initial = center ?? { lat: 20, lng: 0 }; // world view
  return (
    <div className="h-full w-full rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950">
      <MapContainer
        center={[initial.lat, initial.lng]}
        zoom={center ? 10 : 2}
        className="h-full w-full"
        scrollWheelZoom
        worldCopyJump
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url={process.env.NEXT_PUBLIC_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png"}
        />
        {center && (
          <Marker position={[center.lat, center.lng]} icon={icon}>
            <Popup>{label || "Here"}</Popup>
          </Marker>
        )}
        <FlyTo center={center} />
      </MapContainer>
    </div>
  );
}
