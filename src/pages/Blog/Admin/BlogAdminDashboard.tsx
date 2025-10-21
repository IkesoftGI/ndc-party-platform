// src\pages\Blog\Admin\BlogAdminDashboard.tsx

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { BlogPost } from "../../../types/Blog";
import PageWrapper from "../../../components/Layout/PageWrapper";

const LOCAL_STORAGE_KEY = "blogPosts";

export default function BlogAdminDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setPosts(JSON.parse(stored));
    }
  }, []);

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    const updated = posts.filter((p) => p.id !== id);
    setPosts(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <PageWrapper>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>📋 Blog Admin Dashboard</h2>
          <Link to="/admin/blog/new" className="btn btn-primary">
            + Add New Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-muted">No blog posts available yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>Summary</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td>{post.title}</td>
                    <td>{post.excerpt}</td>
                    <td>{post.date}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(post.id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
