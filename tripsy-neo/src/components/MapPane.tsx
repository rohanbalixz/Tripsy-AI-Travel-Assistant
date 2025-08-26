"use client";

import dynamic from "next/dynamic";

const MapCore = dynamic(() => import("./MapCore"), { ssr: false });

type Props = {
  lat?: number | null;
  lon?: number | null;
  label?: string;
};

export default function MapPane(props: Props) {
  return <MapCore {...props} />;
}
