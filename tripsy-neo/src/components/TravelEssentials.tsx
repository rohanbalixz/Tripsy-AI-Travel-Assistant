"use client";

export default function TravelEssentials({ place }: { place?: string }) {
  return (
    <div className="h-full w-full p-4">
      <h3 className="text-emerald-400 font-semibold">Travel Essentials</h3>
      <p className="text-sm text-zinc-300 mt-2">
        {place ? `Essentials for ${place}:` : "Ask about a place to see essentials."}
      </p>
      <ul className="mt-2 text-sm list-disc list-inside text-zinc-300">
        <li>Best season & weather</li>
        <li>Flight & stay ideas</li>
        <li>Local highlights & safety tips</li>
      </ul>
    </div>
  );
}
