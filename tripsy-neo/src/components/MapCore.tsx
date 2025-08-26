"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export type MapProps = {
  lat?: number | null;
  lon?: number | null;
  label?: string;
};

// Fix default marker icons (bundler quirk)
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function FlyTo({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lon], Math.max(map.getZoom(), 11), { duration: 0.8 });
  }, [lat, lon, map]);
  return null;
}

export default function MapCore({ lat = null, lon = null, label }: MapProps) {
  const hasPoint = typeof lat === "number" && typeof lon === "number";
  const center: [number, number] = hasPoint ? [lat as number, lon as number] : [20, 0];

  return (
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={hasPoint ? 11 : 2}
        className="h-full w-full rounded-xl overflow-hidden"
        scrollWheelZoom
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url={process.env.NEXT_PUBLIC_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png"}
        />
        {hasPoint && (
          <>
            <FlyTo lat={lat as number} lon={lon as number} />
            <Marker position={[lat as number, lon as number]}>
              <Popup>{label || "Selected location"}</Popup>
            </Marker>
          </>
        )}
      </MapContainer>
    </div>
  );
}
