"use client";

import dynamic from "next/dynamic";

type Props = {
  center?: [number, number];
  label?: string;
  className?: string;
};

/**
 * Load react-leaflet/leaflet only on the client. All awaits live in the async
 * dynamic factory (not inside the returned component), fixing the build error.
 */
const ClientMap = dynamic(async () => {
  const RL = await import("react-leaflet");
  await import("leaflet/dist/leaflet.css");
  const Lmod = await import("leaflet");
  const L = Lmod.default;

  // Use CDN for default markers to avoid 404s
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });

  const { MapContainer, TileLayer, Marker, Popup } = RL;

  function MapImpl({
    center = [28.6139, 77.209], // New Delhi default
    label = "Selected place",
    className = "",
  }: Props) {
    return (
      <div className={`h-full w-full rounded-2xl overflow-hidden ${className}`}>
        <MapContainer center={center as any} zoom={12} className="h-full w-full">
          <TileLayer url={process.env.NEXT_PUBLIC_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png"} />
          <Marker position={center as any}>
            <Popup>{label}</Popup>
          </Marker>
        </MapContainer>
      </div>
    );
  }

  // Return a component as default from the async factory
  return MapImpl;
}, { ssr: false });

export default function LazyMap(props: Props) {
  return <ClientMap {...props} />;
}
