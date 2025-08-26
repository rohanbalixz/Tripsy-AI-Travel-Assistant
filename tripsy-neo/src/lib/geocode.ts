export async function geocode(q: string): Promise<{ lat: number; lng: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Tripsy/1.0 (demo)" } as any, cache: "no-store" });
    const data = await res.json();
    if (!Array.isArray(data) || !data.length) return null;
    const hit = data[0];
    return { lat: parseFloat(hit.lat), lng: parseFloat(hit.lon) };
  } catch {
    return null;
  }
}
