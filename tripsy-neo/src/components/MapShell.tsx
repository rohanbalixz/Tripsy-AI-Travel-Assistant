"use client";
import dynamic from "next/dynamic";

// Load the heavy map only on the client
const LazyMap = dynamic(() => import("./LazyMap"), { ssr: false });

export default function MapShell(props: any) {
  return <LazyMap {...props} />;
}
