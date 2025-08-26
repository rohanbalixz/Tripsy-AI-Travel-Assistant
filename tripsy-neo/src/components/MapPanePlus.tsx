"use client";
import dynamic from "next/dynamic";
import TravelEssentials from "./TravelEssentials";

// Use your existing Map component (client-only)
const MapPane = dynamic(() => import("./MapPane"), { ssr: false });

export default function MapPanePlus({ place }: { place: string }) {
  return (
    <div style={{display:"flex", flexDirection:"column"}}>
      <MapPane />
      <TravelEssentials place={place} />
    </div>
  );
}
