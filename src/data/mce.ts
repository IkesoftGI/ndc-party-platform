// src/data/mce.ts

export interface MCE {
  constituency: string;
  name: string;
  photo: string;
  term: string;
  status: string; // e.g., "Former MCE"
  bio?: string;
}

export const mces: MCE[] = [
  {
    constituency: "Dome-Kwabenya",
    name: "Hon. Elizabeth Kaaki Mann",
    photo: "/assets/placeholders/official-placeholder.jpg",
    term: "2021 - 2025",
    status: "Former MCE",
    bio: "Served as the Municipal Chief Executive for Ga East Municipal Assembly.",
  },
];
