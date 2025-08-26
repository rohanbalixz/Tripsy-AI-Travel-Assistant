export type PlaceHit = { name: string; lat: number; lon: number };

/** Very small heuristic to extract a "place-y" phrase from text. */
export function guessPlaceFromText(text: string): string | null {
  // Prefer phrases after "show", "take me to", "go to", or capitalized multi-word phrases
  const lowered = text.toLowerCase();

  // Command-style cues
  const cues = ["show", "take me to", "go to", "navigate to", "find", "map", "where is"];
  for (const cue of cues) {
    const idx = lowered.indexOf(cue + " ");
    if (idx !== -1) {
      const tail = text.slice(idx + cue.length + 1).trim();
      // stop at punctuation
      const m = tail.match(/^([A-Z][\w'’.-]*(?:[ ,]+[A-Z][\w'’.-]*){0,4})/);
      if (m) return m[1].replace(/[.,]$/, "");
    }
  }

  // Capitalized chunk heuristic (e.g., "Golden Temple", "Pratapgarh", "New York")
  const cap = text.match(/([A-Z][\w'’.-]*(?:[ ,]+[A-Z][\w'’.-]*){0,4})/g);
  if (cap && cap.length) {
    // Return the last capitalized chunk (often the most recent place mentioned)
    return cap[cap.length - 1].replace(/[.,]$/, "");
  }
  return null;
}

export async function geocodePlace(q: string, abortSignal?: AbortSignal): Promise<PlaceHit | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`;
  const r = await fetch(url, {
    method: "GET",
    headers: { "Accept": "application/json", "User-Agent": "Tripsy/1.0 (demo)" },
    signal: abortSignal,
  });
  if (!r.ok) return null;
  const arr = await r.json();
  if (!Array.isArray(arr) || arr.length === 0) return null;
  const best = arr[0];
  return {
    name: best.display_name || q,
    lat: parseFloat(best.lat),
    lon: parseFloat(best.lon),
  };
}
