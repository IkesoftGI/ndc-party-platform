export interface Project {
  _id?: string;
  id?: string; // ✅ allow both for flexibility
  title: string;
  description: string;
  image?: string;
  region: string;
  constituency: string;
  status: "Ongoing" | "Completed" | "Delayed" | "ongoing" | "completed" | "delayed";
  category:
    | "Health"
    | "Education"
    | "Roads"
    | "Water"
    | "IT"
    | "Agric"
    | "Human-Centered"
    | "Other";
  photo?: string;
  createdAt?: string;
  updatedAt?: string;
}
