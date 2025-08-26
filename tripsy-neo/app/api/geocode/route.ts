export const dynamic = "force-dynamic";

// Extremely naive stub: set Boston if no match; replace with real geocoder later.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const place = (searchParams.get("place") || "").trim();

  // If it looks like Chandigarh / Amritsar / Boston etc, map roughly:
  const preset: Record<string, { lat: number; lng: number; label: string }> = {
    chandigarh: { lat: 30.7333, lng: 76.7794, label: "Chandigarh" },
    amritsar: { lat: 31.6340, lng: 74.8723, label: "Amritsar (Golden Temple)" },
    boston: { lat: 42.3601, lng: -71.0589, label: "Boston" },
    pratapgarh: { lat: 25.9, lng: 81.95, label: "Pratapgarh" },
  };

  const key = place.toLowerCase().split(",")[0].trim();
  const hit = preset[key];
  if (hit) return Response.json(hit);

  return Response.json({ lat: 42.3601, lng: -71.0589, label: place || "Boston" });
}
