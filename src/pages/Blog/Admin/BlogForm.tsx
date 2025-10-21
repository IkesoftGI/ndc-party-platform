// src/pages/Blog/Admin/BlogForm.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import PageWrapper from "../../../components/Layout/PageWrapper";
import type { BlogPost } from "../../../types/Blog";

const LOCAL_STORAGE_KEY = "blogPosts";

const defaultPost: BlogPost = {
  id: "",
  title: "",
  excerpt: "",
  content: "",
  authorId: "NPP Communications", // ✅ fixed!
  date: new Date().toISOString().split("T")[0],
  readingTime: "2 min read",
  categories: [],
  comments: [],
  scope: "national",
  media: [],
};

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost>(defaultPost);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (id) {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const existingPosts: BlogPost[] = JSON.parse(stored);
        const existing = existingPosts.find((p) => p.id === id);
        if (existing) {
          setPost(existing);
          setIsEditMode(true);
        }
      }
    }
  }, [id]);

  const handleSubmit = () => {
  if (!post.title || !post.excerpt || !post.content) {
    alert("Title, Summary, and Content are required.");
    return;
  }

  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  const posts: BlogPost[] = stored ? JSON.parse(stored) : [];

  if (isEditMode && id) {
    const updated = posts.map((p) => (p.id === id ? { ...post } : p));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    console.log("✅ Post updated.");
  } else {
    const newPost = { ...post, id: Date.now().toString() };
    posts.push(newPost);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts));
    console.log("✅ New post saved.");
  }

  console.log("⏳ Redirecting to /admin/blog...");
  setTimeout(() => {
    navigate("/admin/blog");
  }, 100);
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setPost((prev) => ({ ...prev, [name]: value }));
};

  return (
    <PageWrapper>
      <div className="container py-4">
        <h2>{isEditMode ? "✏️ Edit Blog Post" : "+ Add New Blog Post"}</h2>

        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            name="title"
            className="form-control"
            value={post.title}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Summary</label>
          <input
            name="excerpt"
            className="form-control"
            value={post.excerpt}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
  <label className="form-label">Category</label>
  <select
    className="form-select"
    value={(post.categories && post.categories[0]) || ""}
    onChange={(e) =>
      setPost((prev) => ({
        ...prev,
        categories: [e.target.value],
      }))
    }
  >
    <option value="">📝 Blog (default)</option>
    <option value="Announcements">📢 Announcements</option>
    <option value="Party Activities">🏛️ Party Activities</option>
  </select>
</div>
<div className="mb-3">
  <label className="form-label">Content (Markdown supported)</label>
  <textarea
    name="content"
    className="form-control"
    rows={8}
    value={post.content}
    onChange={handleChange}
  />
</div>
        <button className="btn btn-success" onClick={handleSubmit}>
          {isEditMode ? "💾 Update Post" : "🚀 Publish Post"}
        </button>

        <hr />
        <h5 className="mt-4">📄 Live Preview:</h5>
        <div className="border p-3 bg-light rounded">
          <ReactMarkdown>{post.content || "*Start writing to see preview...*"}</ReactMarkdown>
        </div>
      </div>
    </PageWrapper>
  );
}