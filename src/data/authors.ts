// src/data/authors.ts
export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
}

export const authors: Author[] = [
  {
    id: "nana-boakye",
    name: "Nana Yaw Boakye",
    role: "Communications Director",
    bio: "Party strategist and long-serving constituency organizer.",
    image: "/images/authors/nana-boakye.jpg",
  },
  {
    id: "akosua-owusu",
    name: "Akosua Owusu",
    role: "National Women's Organizer",
    bio: "Advocate for women and youth leadership in Ghana.",
    image: "/images/authors/akosua-owusu.jpg",
  }
];
