function cap(s: string) { return s.replace(/\b\w/g, c => c.toUpperCase()); }

function quickItin(city: string, days: number) {
  const ideas = [
    "iconic highlights + orientation walk",
    "neighbourhood cafés & markets",
    "viewpoint / waterfront golden-hour",
    "museum or local craft demo",
    "sunset cruise or rooftop",
    "street-food crawl",
    "day-trip to a nearby gem",
    "hands-on class (cooking/ceramics)",
    "hidden alleys + indie boutiques",
    "farewell dinner with a view",
  ];
  const lines = Array.from({ length: days }).map((_, i) => {
    const a = ideas[(i*3) % ideas.length], b = ideas[(i*3+1)%ideas.length], c = ideas[(i*3+2)%ideas.length];
    return `Day ${i+1}: AM — ${a}. PM — ${b}. Eve — ${c}.`;
  });
  return [
    `Here’s a ${days}-day starter plan for ${city}:`,
    ...lines,
    "Want me to lock this to dates, budgets, and must-haves?"
  ].join("\n");
}

export function fallbackAnswer(q: string): string {
  const text = (q || "").toLowerCase().trim();
  if (!text) return "Hey! Tell me where & when and I’ll spin up options.";
  if (/^(hi|hello|hey|yo|sup)\b/.test(text))
    return "Hey! Where do you want to escape to next—dates & vibe?";
  if (/thank(s| you)\b/.test(text))
    return "Anytime! Want me to sketch a quick plan or hunt great stays?";

  // Shopping in <city>
  const shopMatch = text.match(/shop(?:ping)? .* in ([a-z .-]{2,})\??$/i) || text.match(/best .* in ([a-z .-]{2,})\??$/i);
  if (shopMatch) {
    const city = cap(shopMatch[1].replace(/[^a-z .-]/gi, "").trim());
    return `For shopping in ${city}, start at the pedestrian high street for brands, then the old bazaar for artisans. Set a time window (2–3h) and I’ll map a route by style (budget/boutique/handmade).`;
  }

  // n-day itinerary in <place>
  const daysMatch = text.match(/(\d+)\s*[- ]?\s*day/i);
  const placeMatch = text.match(/\b(?:in|for)\s+([a-z .-]{2,})/i);
  if (daysMatch && placeMatch) {
    const days = Math.min(10, Math.max(1, parseInt(daysMatch[1], 10)));
    const city = cap(placeMatch[1].replace(/[^a-z .-]/gi, "").trim());
    return quickItin(city, days);
  }

  // Generic travel ask
  return "Got it. Share destination, dates, budget, and vibe (chill/food/adventure), and I’ll tailor a plan that actually fits.";
}
