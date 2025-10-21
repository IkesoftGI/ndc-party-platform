// src/components/BlogCards/RegionalBlogCard.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { BlogPost } from "../../types/Blog";

// ✅ Helper to resolve media paths
const resolveMediaPath = (media: string[]) => {
  if (!media || media.length === 0) return "/No Image Available.png";
  const file = media[0].trim();

  if (file.startsWith("http")) return file; // external URL
  if (file.startsWith("/assets/")) return file; // vite-processed
  if (file.startsWith("/uploads/")) return import.meta.env.BASE_URL + file.slice(1);
  if (file.startsWith("/")) return import.meta.env.BASE_URL + file;

  // fallback: filename only (admin-uploaded)
  return import.meta.env.BASE_URL + "uploads/" + file;
};

interface Props {
  region: string;
}

const RegionalBlogCard: React.FC<Props> = ({ region }) => {
  const [regionalPosts, setRegionalPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("blogPosts");
    let posts: BlogPost[] = [];

    if (stored) {
      try {
        posts = JSON.parse(stored) as BlogPost[];
      } catch (err) {
        console.error("Error parsing blogPosts from localStorage:", err);
      }
    }

    const filtered = posts
      .filter(
        (post) =>
          post.scope === "regional" &&
          post.region?.toLowerCase().replace(/[-_]/g, " ").trim() ===
            region.toLowerCase().replace(/[-_]/g, " ").trim() &&
          !post.constituency
      )
      .slice(0, 3);

    setRegionalPosts(filtered);
  }, [region]);

  if (regionalPosts.length === 0) return null;

  return (
    <section className="container py-4 bg-white bg-opacity-75 rounded mt-4">
      <h3 className="text-center fw-bold text-dark">📰 {region} Region Blog</h3>
      <div className="row mt-4">
        {regionalPosts.map((post) => (
          <div className="col-md-4 mb-4" key={post.id}>
            <div className="card h-100 shadow">
              <img
                src={resolveMediaPath(post.media)}
                alt={post.title}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/No Image Available.png";
                }}
              />
              <div className="card-body">
                <h5 className="card-title text-dark">{post.title}</h5>
                <p className="card-text text-dark">{post.excerpt}</p>
                <Link
                  to={`/regions/${region.toLowerCase().replace(/\s+/g, "-")}/blog/${post.id}`}
                  className="btn btn-primary"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <Link
          to={`/regions/${region.toLowerCase().replace(/\s+/g, "-")}/blog`}
          className="btn btn-outline-dark fw-bold"
        >
          🌍 View All {region} Region Blog Posts
        </Link>
      </div>
    </section>
  );
};

export default RegionalBlogCard;
