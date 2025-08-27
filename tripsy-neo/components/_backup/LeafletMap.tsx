"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Inner = dynamic(() => import("./LeafletMapInner.client"), { ssr: false });

type Props = { center: [number, number]; zoom?: number; label?: string; className?: string };

export default function LeafletMap(props: Props) {
  const [ready, setReady] = useState(false);
  const mounted = useRef(false);
  useEffect(() => {
    // allow only the first mount in dev (Strict/FastRefresh may try twice)
    if (mounted.current) return;
    mounted.current = true;
    // defer one tick to guarantee a clean node
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);
  if (!ready) return null;
  return <Inner {...props} />;
}
