// src\utils\photo.ts

// Central place to resolve old local filenames and new Cloudinary URLs
export const resolvePhotoUrl = (raw?: string, apiBase?: string) => {
  if (!raw) return "/No Image Available.png";
  // If already absolute (Cloudinary or any CDN), just use it.
  if (/^https?:\/\//i.test(raw)) return raw;
  // Legacy local uploads (keep for older records)
  const base = (apiBase || import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
  return `${base}/uploads/${raw.replace(/^\/+/, "")}`;
};
