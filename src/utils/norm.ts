// src/utils/norm.ts

/**
 * Normalize text values like region, constituency, units, etc.
 * - Lowercases everything
 * - Replaces dashes with spaces
 * - Removes all spaces
 * - Trims leading/trailing whitespace
 */
export const norm = (s?: string): string =>
  (s || "")
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/\s+/g, "")
    .trim();

    