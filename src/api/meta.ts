// src\api\meta.ts

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export async function getConstituencies(region: string) {
  const res = await fetch(`${BASE_URL}/api/meta/constituencies?region=${encodeURIComponent(region)}`);
  const j = await res.json();
  if (!res.ok || !j.ok) throw new Error("Failed to load constituencies");
  return j.data as string[];
}

export async function searchElectoralAreas(constituency: string, q = "") {
  const res = await fetch(`${BASE_URL}/api/meta/electoral-areas?constituency=${encodeURIComponent(constituency)}&q=${encodeURIComponent(q)}`);
  const j = await res.json();
  if (!res.ok || !j.ok) throw new Error("Failed to load electoral areas");
  return j.data as string[];
}

export async function searchPollingStations(constituency: string, q = "") {
  const res = await fetch(`${BASE_URL}/api/meta/polling-stations?constituency=${encodeURIComponent(constituency)}&q=${encodeURIComponent(q)}`);
  const j = await res.json();
  if (!res.ok || !j.ok) throw new Error("Failed to load polling stations");
  return j.data as string[];
}
