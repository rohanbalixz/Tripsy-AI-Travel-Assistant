"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { TILE_URL } from "@/lib/env";

/**
 * React-Leaflet must only render on the client, so we dynamically import
 * the components we need after mount. This keeps it compatible with Next.js.
 */
const Leaflet = dynamic(async () => {
  const mod = await import("react-leaflet");
  return {
    default: (props: any) => {
      const { MapContainer, TileLayer, Marker, Popup, ScaleControl } = mod;
      return (
        <MapContainer
          center={props.center}
          zoom={props.zoom}
          className="h-full w-full rounded-2xl"
          scrollWheelZoom
        >
          <TileLayer url={TILE_URL} attribution='&copy; OpenStreetMap' />
          {props.showMarker && (
            <Marker position={props.center}>
              <Popup>You are here</Popup>
            </Marker>
          )}
          <ScaleControl position="bottomleft" />
        </MapContainer>
      );
    },
  } as any;
}, { ssr: false });

/** Fix Leaflet default icon paths in bundlers like Next */
function fixLeafletIcons() {
  // @ts-ignore
  delete (global as any).L?.Icon.Default.prototype._getIconUrl;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const L = require("leaflet");
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

export default function Map({
  initialCenter = [28.6139, 77.2090], // New Delhi as a neutral default
  initialZoom = 12,
  useGeolocation = true,
}: {
  initialCenter?: [number, number];
  initialZoom?: number;
  useGeolocation?: boolean;
}) {
  const [center, setCenter] = useState<[number, number]>(initialCenter);
  const [zoom, setZoom] = useState(initialZoom);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fixLeafletIcons();
    setReady(true);
  }, []);

  // try HTML5 geolocation (no cost)
  useEffect(() => {
    if (!useGeolocation || !navigator.geolocation) return;
    const id = navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setCenter(c);
        setZoom(13);
      },
      () => {
        /* ignore error; we’ll keep default center */
      },
      { enableHighAccuracy: true, timeout: 4000, maximumAge: 60000 }
    );
    return () => {
      // no watcher used, nothing to clear
    };
  }, [useGeolocation]);

  const showMarker = useMemo(() => true, []);

  if (!ready) {
    return (
      <div className="h-full w-full grid place-items-center rounded-2xl border border-white/10">
        <span className="text-sm text-white/70">Loading map…</span>
      </div>
    );
  }

  // @ts-ignore — Leaflet is default export of dynamic wrapper above
  return <Leaflet center={center} zoom={zoom} showMarker={showMarker} />;
}
