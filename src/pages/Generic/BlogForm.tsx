// src/pages/Generic/BlogForm.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import PageWithFlagBackground from "@components/Layout/PageWithFlagBackground";
import type { BlogPost } from "../../types/Blog";

// ✅ Dynamic localStorage key
const getStorageKey = (scope: string, region?: string, constituency?: string) => {
  if (scope === "national") return "blogPosts_national";
  if (scope === "regional" && region) return `blogPosts_${region.toLowerCase()}`;
  if (scope === "constituency" && region && constituency) {
    return `blogPosts_${region.toLowerCase()}_${constituency.toLowerCase()}`;
  }
  return "blogPosts";
};

// ✅ Default post (scope injected later)
const defaultPost: Omit<BlogPost, "scope"> = {
  id: "",
  title: "",
  excerpt: "",
  content: "",
  authorId: "NDC Communications",
  date: new Date().toISOString().split("T")[0],
  readingTime: "2 min read",
  categories: [],
  comments: [],
  media: [],
};

export default function BlogForm() {
  const { id, region, constituency } = useParams<{
    id?: string;
    region?: string;
    constituency?: string;
  }>();
  const navigate = useNavigate();

  // ✅ Scope auto-decided from URL
  const resolveScope = (): "national" | "regional" | "constituency" => {
    if (constituency) return "constituency";
    if (region) return "regional";
    return "national";
  };

  const forcedScope = resolveScope();
  const STORAGE_KEY = getStorageKey(forcedScope, region, constituency);

  const [post, setPost] = useState<BlogPost>({
    ...defaultPost,
    scope: forcedScope,         // ✅ initialize with actual scope
    region: region || "",
    constituency: constituency || "",
  });
  const [isEditMode, setIsEditMode] = useState(false);

  const basePath = region
    ? constituency
      ? `/regions/${region}/constituencies/${constituency}/blog`
      : `/regions/${region}/blog`
    : `/blog`;

  // ✅ Load existing post in edit mode
  useEffect(() => {
    if (id) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const existingPosts: BlogPost[] = JSON.parse(stored);
        const existing = existingPosts.find((p) => p.id === id);
        if (existing) {
          setPost(existing);
          setIsEditMode(true);
        }
      }
    }
  }, [id, STORAGE_KEY]);

  // ✅ File uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPost((prev) => ({
          ...prev,
          media: [...(prev.media || []), reader.result as string],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  /// ✅ Submit
const handleSubmit = () => {
  if (!post.title || !post.excerpt || !post.content) {
    alert("Title, Summary, and Content are required.");
    return;
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  const posts: BlogPost[] = stored ? JSON.parse(stored) : [];

  if (isEditMode && id) {
    const updated = posts.map((p) =>
      p.id === id
        ? {
            ...post,
            scope: forcedScope,
            region: region || "",
            constituency: constituency || "",
          }
        : p
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } else {
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      scope: forcedScope,
      region: region || "",
      constituency: constituency || "",
    };
    posts.push(newPost);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }

  navigate(basePath);
};


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <PageWithFlagBackground title={isEditMode ? "✏️ Edit Blog Post" : "+ Add Blog Post"}>
      <div className="container py-4">
        {/* ✅ Show correct metadata */}
        <div className="mb-3">
          <label className="form-label text-dark fw-bold">Scope</label>
          <input
            type="text"
            className="form-control text-dark"
            value={post.scope}
            readOnly
          />
        </div>
        {region && (
          <div className="mb-3">
            <label className="form-label text-dark fw-bold">Region</label>
            <input type="text" className="form-control text-dark" value={region} readOnly />
          </div>
        )}
        {constituency && (
          <div className="mb-3">
            <label className="form-label text-dark fw-bold">Constituency</label>
            <input type="text" className="form-control text-dark" value={constituency} readOnly />
          </div>
        )}

        {/* Title */}
        <div className="mb-3">
          <label className="form-label text-dark fw-bold">Title</label>
          <input
            name="title"
            className="form-control text-dark"
            value={post.title}
            onChange={handleChange}
          />
        </div>

        {/* Excerpt + Headline */}
        <div className="mb-3">
          <label className="form-label text-dark fw-bold">Summary</label>
          <input
            name="excerpt"
            className="form-control text-dark"
            value={post.excerpt}
            onChange={handleChange}
          />
          <div className="mb-3">
            <label className="form-label text-dark fw-bold">Headline (optional)</label>
            <input
              name="headline"
              className="form-control text-dark"
              value={post.headline || ""}
              onChange={handleChange}
              placeholder="Short text for ticker (optional)"
            />
          </div>
        </div>

        {/* Category */}
        <div className="mb-3">
          <label className="form-label text-dark fw-bold">Category</label>
          <select
            className="form-select text-dark"
            value={(post.categories && post.categories[0]) || ""}
            onChange={(e) =>
              setPost((prev) => ({ ...prev, categories: [e.target.value] }))
            }
          >
            <option value="">📝 Blog (default)</option>
            <option value="Announcements">📢 Announcements</option>
            <option value="Party Activities">🏛️ Party Activities</option>
          </select>
        </div>

        {/* Content */}
        <div className="mb-3">
          <label className="form-label text-dark fw-bold">Content</label>
          <textarea
            name="content"
            className="form-control text-dark"
            rows={8}
            value={post.content}
            onChange={handleChange}
          />
        </div>

        {/* File Upload */}
        <div className="mb-3">
          <label className="form-label text-dark fw-bold">Media (Images/Videos)</label>
          <input
            type="file"
            accept="image/*,video/*"
            className="form-control"
            multiple
            onChange={handleFileUpload}
          />
          {post.media && post.media.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mt-3">
              {post.media.map((file, idx) => (
                <div key={idx} style={{ width: "120px" }}>
                  {file.startsWith("data:video") ? (
                    <video src={file} controls style={{ width: "100%" }} />
                  ) : (
                    <img src={file} alt={`media-${idx}`} style={{ width: "100%" }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button className="btn btn-success" onClick={handleSubmit}>
          {isEditMode ? "💾 Update Post" : "🚀 Publish Post"}
        </button>

        <hr />
        <h5 className="text-dark fw-bold">📄 Live Preview:</h5>
        <div className="border p-3 bg-light rounded">
          <ReactMarkdown>
            {post.content || "*Start writing to see preview...*"}
          </ReactMarkdown>
        </div>
      </div>
    </PageWithFlagBackground>
  );
}
