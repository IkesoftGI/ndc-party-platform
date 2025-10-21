// src/components/NationalBlogCard.tsx
import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import { blogPosts as staticPosts } from "@data/blogPosts";
import { Link } from "react-router-dom";
import "@styles/Home.css";
import type { BlogPost } from "./../types/Blog";

// ✅ Unified resolver for imported + dynamic
const resolveMediaPath = (media: string[]) => {
  if (media.length === 0) return "/No Image Available.png";
  const file = media[0].trim();

  if (file.startsWith("http")) return file; // absolute URL
  if (file.startsWith("/assets/")) return file; // already processed import
  if (file.startsWith("/uploads/")) return import.meta.env.BASE_URL + file.slice(1);
  if (file.startsWith("/")) return import.meta.env.BASE_URL + file;
  return import.meta.env.BASE_URL + "uploads/" + file; // assume filename only
};

interface NationalBlogCardProps {
  posts?: BlogPost[];
}

const NationalBlogCard: React.FC<NationalBlogCardProps> = ({ posts }) => {
  const [displayPosts, setDisplayPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const filterNationalWithMedia = (list: BlogPost[]) =>
      list
        .filter(
          (p) => p.scope?.trim().toLowerCase() === "national" && p.media.length > 0
        )
        .slice(0, 3);

    let source: BlogPost[] = [];

    if (posts !== undefined) {
      source = posts;
    } else {
      const local = localStorage.getItem("blogPosts");
      if (local) {
        try {
          const parsed: BlogPost[] = JSON.parse(local);
          source = parsed;
        } catch (err) {
          console.error("Error parsing localStorage blogPosts:", err);
        }
      }
      if (source.length === 0) {
        source = staticPosts;
      }
    }

    const nationals = filterNationalWithMedia(source);
    setDisplayPosts(nationals);

    // 🔎 Debug log
    console.table(
      nationals.map((p) => ({
        id: p.id,
        title: p.title,
        rawMedia: p.media,
        resolved: resolveMediaPath(p.media),
      }))
    );
  }, [posts]);

  return (
    <section className="container bg-white bg-opacity-75 rounded p-3">
      <h4 className="text-dark fw-bold mb-3 text-center">
        📰 National Blog Highlights
      </h4>

      {displayPosts.length > 0 ? (
        <Carousel
          interval={5000}
          pause="hover"
          fade={false}
          controls
          indicators={false}
          className="national-blog-carousel"
        >
          {displayPosts.map((post) => (
            <Carousel.Item key={post.id}>
              <div
                className="card mx-auto shadow"
                style={{ maxWidth: "800px" }}
              >
                <img
                  src={resolveMediaPath(post.media)}
                  alt={post.title}
                  className="card-img-top"
                  style={{ height: "250px", objectFit: "cover" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/No Image Available.png";
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title text-dark">{post.title}</h5>
                  <p className="card-text text-dark">{post.excerpt}</p>
                  <Link to={`/blog/${post.id}`} className="btn btn-primary">
                    Read More
                  </Link>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <p className="text-center text-muted">
          No national blog posts available.
        </p>
      )}
    </section>
  );
};

export default NationalBlogCard;
