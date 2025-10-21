// src/pages/Generic/BlogPostPage.tsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Carousel } from "react-bootstrap";
import { blogPosts as staticBlogPosts } from "@data/blogPosts";
import type { BlogPost } from "../../types/Blog";
import CommentSection from "@components/CommentSection";
import "@styles/Blog.css";

// ✅ Normalizer
const norm = (s: unknown) =>
  String(s ?? "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// ✅ Dynamic localStorage key (same as BlogForm & BlogPage)
const getStorageKey = (scope: string, region?: string, constituency?: string) => {
  if (scope === "national") return "blogPosts_national";
  if (scope === "regional" && region) return `blogPosts_${region.toLowerCase()}`;
  if (scope === "constituency" && region && constituency) {
    return `blogPosts_${region.toLowerCase()}_${constituency.toLowerCase()}`;
  }
  return "blogPosts";
};

type ReactionKey = "like" | "love" | "wow" | "sad" | "angry";
type Reactions = Record<ReactionKey, number>;
const defaultReactions: Reactions = { like: 0, love: 0, wow: 0, sad: 0, angry: 0 };

export default function BlogPostPage() {
  const { id, region, constituency } = useParams<{
    id: string;
    region?: string;
    constituency?: string;
  }>();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [reactions, setReactions] = useState<Reactions>(defaultReactions);

  // ✅ Decide scope + storage key
  const scope = constituency ? "constituency" : region ? "regional" : "national";
  const STORAGE_KEY = getStorageKey(scope, region, constituency);

  // Merge posts (static + localStorage, no duplicates)
  const allPosts = useMemo<BlogPost[]>(() => {
    let merged: BlogPost[] = [...staticBlogPosts];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as BlogPost[];
        parsed.forEach((p) => {
          if (!merged.find((m) => norm(m.id) === norm(p.id))) merged.push(p);
        });
      }
    } catch (e) {
      console.error("Failed to read blogPosts from", STORAGE_KEY, e);
    }
    return merged;
  }, [STORAGE_KEY]);

  // ✅ Find the post
  useEffect(() => {
    if (!id) return;

    const wantId = norm(id);
    const wantRegion = norm(region);
    const wantConstituency = norm(constituency);

    let found =
      allPosts.find(
        (p) =>
          norm(p.id) === wantId &&
          (!region || norm(p.region) === wantRegion) &&
          (!constituency || norm(p.constituency) === wantConstituency)
      ) || null;

    // Fallbacks
    if (!found) {
      found =
        allPosts.find(
          (p) =>
            (p as any).slug &&
            norm((p as any).slug) === wantId &&
            (!region || norm(p.region) === wantRegion) &&
            (!constituency || norm(p.constituency) === wantConstituency)
        ) || null;
    }
    if (!found) {
      found =
        allPosts.find(
          (p) =>
            norm(p.title) === wantId &&
            (!region || norm(p.region) === wantRegion) &&
            (!constituency || norm(p.constituency) === wantConstituency)
        ) || null;
    }

    setPost(found);
  }, [id, region, constituency, allPosts]);

  // ✅ Load reactions
  useEffect(() => {
    if (!post) return;
    try {
      const saved = localStorage.getItem(`post-reactions-${post.id}`);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<Reactions>;
        setReactions({ ...defaultReactions, ...parsed });
      } else {
        setReactions(defaultReactions);
      }
    } catch {
      setReactions(defaultReactions);
    }
  }, [post]);

  // ✅ Reaction handler
  const handleReaction = (type: ReactionKey) => {
    if (!post) return;

    const userKey = `post-user-reaction-${post.id}`;
    const prevReaction = localStorage.getItem(userKey) as ReactionKey | null;

    const updated: Reactions = { ...reactions };

    if (prevReaction === type) {
      updated[type] = Math.max(0, updated[type] - 1);
      localStorage.removeItem(userKey);
    } else {
      if (prevReaction) {
        updated[prevReaction] = Math.max(0, updated[prevReaction] - 1);
      }
      updated[type] = (updated[type] || 0) + 1;
      localStorage.setItem(userKey, type);
    }

    setReactions(updated);
    localStorage.setItem(`post-reactions-${post.id}`, JSON.stringify(updated));
  };

  if (!post) {
    return (
      <div className="container py-5">
        <Link
          to={
            constituency
              ? `/regions/${region}/constituencies/${constituency}/blog`
              : region
              ? `/regions/${region}/blog`
              : `/blog`
          }
          className="btn btn-warning mb-3"
        >
          ⬅ Back
        </Link>
        <div className="alert alert-danger">Post not found.</div>
      </div>
    );
  }

  const media = Array.isArray(post.media) ? post.media : [];
  const isVideo = (url: string) =>
    url.startsWith("data:video") || /\.(mp4|webm|ogg)$/i.test(url);

  return (
    <div className="container py-5">
      <Link
        to={
          constituency
            ? `/regions/${region}/constituencies/${constituency}/blog`
            : region
            ? `/regions/${region}/blog`
            : `/blog`
        }
        className="btn btn-warning mb-3"
      >
        ⬅ Back
      </Link>

      <h2 className="fw-bold">{post.title}</h2>
      <p className="text-muted">{post.date}</p>

      {/* Media gallery */}
      {media.length > 0 &&
        (media.length === 1 ? (
          <div className="mb-3">
            {isVideo(media[0]) ? (
              <video src={media[0]} className="w-100 rounded" controls />
            ) : (
              <img
                src={media[0]}
                alt={post.title}
                className="img-fluid rounded"
                style={{ maxHeight: 480, objectFit: "cover", width: "100%" }}
              />
            )}
          </div>
        ) : (
          <Carousel className="mb-3">
            {media.map((m, i) => (
              <Carousel.Item key={i}>
                {isVideo(m) ? (
                  <video src={m} className="w-100 rounded" controls />
                ) : (
                  <img
                    src={m}
                    alt={`${post.title} media ${i + 1}`}
                    className="d-block w-100 rounded"
                    style={{ maxHeight: 480, objectFit: "cover" }}
                  />
                )}
              </Carousel.Item>
            ))}
          </Carousel>
        ))}

      {/* Body */}
      {post.content ? (
        <div className="mb-4">
          <p>{post.content}</p>
        </div>
      ) : (
        <div className="mb-4 text-muted">No additional content.</div>
      )}

      {/* ✅ Reactions */}
      <div className="reaction-bar d-flex gap-3 mb-4 p-2 border rounded shadow-sm bg-light">
        {([
          { key: "like", emoji: "👍", color: "text-primary" },
          { key: "love", emoji: "❤️", color: "text-danger" },
          { key: "wow", emoji: "😮", color: "text-warning" },
          { key: "sad", emoji: "😢", color: "text-info" },
          { key: "angry", emoji: "😡", color: "text-dark" },
        ] as const).map((r) => (
          <div
            key={r.key}
            className="text-center cursor-pointer"
            style={{ width: 50 }}
            onClick={() => handleReaction(r.key)}
          >
            <div className="fw-bold small">{reactions[r.key]}</div>
            <div className={`fs-3 ${r.color}`}>{r.emoji}</div>
          </div>
        ))}
      </div>

      {/* Comments */}
      <CommentSection type="blog" id={norm(post.id)} />
    </div>
  );
}
