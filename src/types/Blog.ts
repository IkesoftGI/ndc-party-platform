// src/types/Blog.ts

export interface Comment {
  id: string;      // unique id for each comment
  name: string;    // commenter name
  message: string; // comment body
  date: string;    // timestamp
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;       // short preview text
  content: string;        // full post body
  date: string;           // YYYY-MM-DD or ISO string
  author?: string;
  authorId?: string;
  readingTime?: string;   // e.g. "3 min read"

  // ✅ standardized: every post has a media array
  media: string[];        // image or video URLs/base64 (can be empty [])

  scope: "national" | "regional" | "constituency";
  region?: string;
  constituency?: string;
  headline?: string;
  categories?: string[];
  comments: Comment[];    // always an array, even if empty
}
