// src/pages/Generic/BlogAdminDashboard.tsx

import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { BlogPost } from "../../types/Blog";
import PageWithFlagBackground from "@components/Layout/PageWithFlagBackground";

const LOCAL_STORAGE_KEY = "blogPosts";

function isStrongPassword(password: string): string | null {
  if (password.length < 12) return "Password must be at least 12 characters long.";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain a number.";
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
    return "Password must contain a special character.";
  return null;
}

export default function BlogAdminDashboard() {
  const navigate = useNavigate();
  const { region, constituency } = useParams<{ region?: string; constituency?: string }>();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // ✅ Credentials replacement
  const [newCreds, setNewCreds] = useState({ username: "admin", password: "0000" });
  const [confirmPassword, setConfirmPassword] = useState("0000");
  const [securityAnswers, setSecurityAnswers] = useState({
    pet: "",
    mother: "",
    teacher: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) setPosts(JSON.parse(stored));
  }, []);

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    const updated = posts.filter((p) => p.id !== id);
    setPosts(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleUpdateCredentials = () => {
    if (!newCreds.username || !newCreds.password) {
      alert("⚠️ Please fill in all fields");
      return;
    }
    if (newCreds.password !== confirmPassword) {
      alert("⚠️ Passwords do not match");
      return;
    }

    const strengthError = isStrongPassword(newCreds.password);
    if (strengthError) {
      alert("⚠️ " + strengthError);
      return;
    }

    if (!securityAnswers.pet || !securityAnswers.mother || !securityAnswers.teacher) {
      alert("⚠️ Please answer all security questions");
      return;
    }

    localStorage.setItem("adminCredentials", JSON.stringify(newCreds));
    localStorage.setItem("adminSecurity", JSON.stringify(securityAnswers));

    alert("✅ Credentials updated successfully! Use them next time you log in.");
    setNewCreds({ username: "admin", password: "0000" });
    setConfirmPassword("0000");
    setSecurityAnswers({ pet: "", mother: "", teacher: "" });
  };

  const basePath = region
    ? constituency
      ? `/regions/${region}/constituencies/${constituency}/blog`
      : `/regions/${region}/blog`
    : `/blog`;

  // ✅ Filtering
  const filteredPosts = posts.filter(
    (p) =>
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Pagination
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <PageWithFlagBackground title="📋 Blog Admin Dashboard">
      <div className="container py-4">
        {/* Top bar */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>📋 Blog Admin Dashboard</h4>
          <Link to={`${basePath}/admin/new`} className="btn btn-primary">
            + Add New Post
          </Link>
        </div>

        {/* 🔎 Search */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by ID or Title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Blog Posts Table */}
        {filteredPosts.length === 0 ? (
          <p className="text-muted">No blog posts found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "120px" }}>ID</th>
                  <th>Title</th>
                  <th style={{ width: "150px" }}>Date</th>
                  <th style={{ width: "160px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.map((post) => (
                  <tr key={post.id}>
                    <td className="small text-muted">{post.id}</td>
                    <td>{post.title}</td>
                    <td>{post.date}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => navigate(`${basePath}/admin/edit/${post.id}`)}
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

        {/* 📄 Pagination */}
        {totalPages > 1 && (
          <nav>
            <ul className="pagination justify-content-center mt-3">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  ⬅️ Prev
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i + 1}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                >
                  Next ➡️
                </button>
              </li>
            </ul>
          </nav>
        )}

        {/* ⚙️ Credentials Replacement */}
        <div className="mt-5 p-4 border rounded">
          <h5 className="mb-3">⚙️ Replace Admin Credentials</h5>

          {/* New Username */}
          <div className="mb-2 input-group">
            <span className="input-group-text">👤</span>
            <input
              type="text"
              className="form-control"
              placeholder="New Username"
              value={newCreds.username}
              onChange={(e) => setNewCreds({ ...newCreds, username: e.target.value })}
            />
          </div>

          {/* New Password */}
          <div className="mb-2 input-group">
            <span className="input-group-text">🔑</span>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="New Password"
              value={newCreds.password}
              onChange={(e) => setNewCreds({ ...newCreds, password: e.target.value })}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈 Hide" : "👁 Show"}
            </button>
          </div>

          {/* Repeat Password */}
          <div className="mb-2 input-group">
            <span className="input-group-text">🔑</span>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Repeat New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈 Hide" : "👁 Show"}
            </button>
          </div>

          <small className="text-muted d-block mb-3">
            Password must be at least 12 characters long and include uppercase, lowercase, a number, and a symbol.
          </small>

          {/* Security Questions */}
          <div className="mb-3">
            <label className="form-label">Security Questions</label>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="What is the name of your first pet?"
              value={securityAnswers.pet}
              onChange={(e) =>
                setSecurityAnswers({ ...securityAnswers, pet: e.target.value })
              }
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="What is your mother's maiden name?"
              value={securityAnswers.mother}
              onChange={(e) =>
                setSecurityAnswers({ ...securityAnswers, mother: e.target.value })
              }
            />
            <input
              type="text"
              className="form-control"
              placeholder="Who was your favorite teacher?"
              value={securityAnswers.teacher}
              onChange={(e) =>
                setSecurityAnswers({ ...securityAnswers, teacher: e.target.value })
              }
            />
          </div>

          <button className="btn btn-dark w-100" onClick={handleUpdateCredentials}>
            Update Credentials
          </button>
        </div>
      </div>
    </PageWithFlagBackground>
  );
}
