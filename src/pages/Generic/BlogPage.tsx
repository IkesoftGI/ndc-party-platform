// src/pages/Generic/BlogPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col, Alert } from "react-bootstrap";
import { blogPosts as staticBlogPosts } from "@data/blogPosts";
import type { BlogPost } from "../../types/Blog";
import NewsTicker from "@components/Shared/NewsTicker"; // ✅ add ticker

// ✅ Normalize string → slug
const norm = (s?: string) =>
  (s ?? "")
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");

// ✅ Pretty-print slug
const humanize = (slug?: string) =>
  (slug ?? "")
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");

// ✅ Pick first image
const imageOf = (media?: string[]) =>
  (media && media[0]) || "/No Image Available.png";

// ✅ Dynamic localStorage key (same as BlogForm.tsx)
const getStorageKey = (scope: string, region?: string, constituency?: string) => {
  if (scope === "national") return "blogPosts_national";
  if (scope === "regional" && region) return `blogPosts_${region.toLowerCase()}`;
  if (scope === "constituency" && region && constituency) {
    return `blogPosts_${region.toLowerCase()}_${constituency.toLowerCase()}`;
  }
  return "blogPosts";
};

export default function BlogPage() {
  const { region, constituency } = useParams<{
    region?: string;
    constituency?: string;
  }>();

  const [posts, setPosts] = useState<BlogPost[]>([]);

  // ✅ Decide scope
  const scope =
    constituency ? "constituency" : region ? "regional" : "national";
  const STORAGE_KEY = getStorageKey(scope, region, constituency);

  // Merge static + localStorage once
  const allPosts = useMemo<BlogPost[]>(() => {
    let merged: BlogPost[] = [...staticBlogPosts];

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as BlogPost[];
        parsed.forEach((p) => {
          if (!merged.find((m) => String(m.id) === String(p.id))) {
            merged.push(p);
          }
        });
      }
    } catch (e) {
      console.error("Failed to read blogPosts from", STORAGE_KEY, e);
    }

    // Sort newest-ish first by date (fallback to id for stability)
    return [...merged].sort((a, b) => {
      const da = new Date(a.date || 0).getTime();
      const db = new Date(b.date || 0).getTime();
      if (db !== da) return db - da;
      return String(b.id).localeCompare(String(a.id));
    });
  }, [STORAGE_KEY]);

  // Filter by scope from route
  useEffect(() => {
    const wantRegion = norm(region);
    const wantConstituency = norm(constituency);

    const filtered = allPosts.filter((p) => {
      if (scope === "national") return p.scope === "national";

      if (scope === "regional") {
        return p.scope === "regional" && norm(p.region) === wantRegion;
      }

      // constituency scope
      return (
        p.scope === "constituency" &&
        norm(p.region) === wantRegion &&
        norm(p.constituency) === wantConstituency
      );
    });

    setPosts(filtered);
  }, [allPosts, scope, region, constituency]);

  // Title
  let title = "National Blog";
  if (region && !constituency) title = `${humanize(norm(region))} Blog`;
  if (region && constituency) title = `${humanize(norm(constituency))} Blog`;

  // Build read-more link per scope
  const linkFor = (p: BlogPost) => {
    if (region && constituency) {
      return `/regions/${norm(region!)}/constituencies/${norm(
        constituency!
      )}/blog/${p.id}`;
    }
    if (region) {
      return `/regions/${norm(region!)}/blog/${p.id}`;
    }
    return `/blog/${p.id}`;
  };

  return (
    <div className="container py-4">
      {/* ✅ News ticker with posts that have headline */}
      <NewsTicker posts={posts.filter((p) => p.headline)} />

      <h2 className="mb-4 text-center">{title}</h2>

      {posts.length === 0 ? (
        <Alert variant="info" className="text-center">
          No blog posts found for this scope.
        </Alert>
      ) : (
        <Row className="g-4">
          {posts.map((post) => (
            <Col xs={12} md={6} lg={4} key={post.id}>
              <Card className="shadow h-100">
                <img
                  src={imageOf(post.media)}
                  alt={post.title}
                  className="card-img-top"
                  style={{ height: 300, objectFit: "cover" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/No Image Available.png";
                  }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fw-bold">{post.title}</Card.Title>
                  <Card.Text className="text-muted mb-2">
                    {post.date}
                    {post.readingTime ? ` • ${post.readingTime}` : ""}
                  </Card.Text>
                  <Card.Text className="flex-grow-1">
                    {post.excerpt
                      ? post.excerpt.slice(0, 140) +
                        (post.excerpt.length > 140 ? "…" : "")
                      : post.content.slice(0, 140) +
                        (post.content.length > 140 ? "…" : "")}
                  </Card.Text>
                  <div className="mt-auto">
                    <Link to={linkFor(post)} className="btn btn-primary">
                      Read More
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Back nav */}
      <div className="mt-4 text-center">
        {region ? (
          constituency ? (
            <Link
              to={`/regions/${norm(region)}/blog`}
              className="btn btn-outline-secondary"
            >
              ⬅ Back to {humanize(norm(region))} Blog
            </Link>
          ) : (
            <Link to="/regions" className="btn btn-outline-secondary">
              ⬅ Back to Regions
            </Link>
          )
        ) : (
          <Link to="/" className="btn btn-outline-secondary">
            ⬅ Back Home
          </Link>
        )}
      </div>
    </div>
  );
}
