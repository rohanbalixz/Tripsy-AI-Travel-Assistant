export type GeoHit = { lat: number; lng: number; display_name: string };

export async function geocode(q: string): Promise<GeoHit | null> {
  const query = q.trim();
  if (!query) return null;

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("q", query);

  const res = await fetch(url.toString(), {
    headers: {
      // Be nice to Nominatim
      "User-Agent": "Tripsy/1.0 (demo)",
      "Accept-Language": "en",
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data = (await res.json()) as Array<any>;
  if (!data?.length) return null;
  const hit = data[0];
  return { lat: parseFloat(hit.lat), lng: parseFloat(hit.lon), display_name: hit.display_name };
}
