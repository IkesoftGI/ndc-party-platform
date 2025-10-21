// src/utils/getAuthorName.ts
import { authors } from "../data/authors";

export function getAuthorName(authorId?: string): string {
  if (!authorId) return "Unknown";
  const author = authors.find((a) => a.id === authorId);
  return author?.name || "Unknown";
}

