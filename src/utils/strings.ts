// src/utils/strings.ts
export function slugToTitle(slug: string): string {
  const safe = decodeURIComponent(slug || "").trim();
  return safe
    .split("-")
    .map((part) => {
      // keep pure numbers as-is (e.g., "01")
      if (/^\d+$/.test(part)) return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}
