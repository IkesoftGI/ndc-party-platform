import { Link, useNavigate } from "react-router-dom";
import ndcFlag from "../assets/NDC.png"; // ✅ NDC umbrella logo
import { useAuth } from "../context/AuthContext";
import type { User } from "../types/User";

export default function Header() {
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ User constituency URL
  const storedUserStr = localStorage.getItem("lastUser");
  const storedUser = storedUserStr ? (JSON.parse(storedUserStr) as User) : null;
  const userConstituencyUrl = storedUser
    ? `/regions/${storedUser.region.toLowerCase().replace(/\s+/g, "-")}/constituencies/${storedUser.constituency
        .toLowerCase()
        .replace(/\s+/g, "-")}`
    : "/dashboard";

  return (
    <header
      style={{
        background: "linear-gradient(90deg, #00843D 0%, #E71D36 50%, #000000 100%)",
        color: "white",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
      }}
    >
      {/* ✅ Top Row: Brand with Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.6rem 1rem",
        }}
      >
        <img
          src={ndcFlag}
          alt="NDC Party Platform Logo"
          style={{
            width: 46,
            height: 46,
            borderRadius: "8px",
            backgroundColor: "white",
            padding: "3px",
          }}
        />
        <h1
          style={{
            fontSize: "1.3rem",
            margin: 0,
            fontWeight: 700,
            letterSpacing: "0.5px",
            color: "white",
          }}
        >
          NDC Party Platform
        </h1>
      </div>

      {/* ✅ Navigation links */}
      <nav
        className="nav-scroller"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.8rem",
          padding: "0.4rem 1rem 0.6rem",
          flexWrap: "nowrap",
          overflowX: "auto",
          backgroundColor: "rgba(0,0,0,0.15)",
        }}
      >
        <Link className="navlink" to="/nhqt" style={{ fontSize: "0.9rem" }}>
          HQ
        </Link>
        <Link className="navlink" to="/presidents" style={{ fontSize: "0.9rem" }}>
          Presidents
        </Link>
        <Link className="navlink" to="/executives" style={{ fontSize: "0.9rem" }}>
          Executives
        </Link>
        <Link
          className="navlink"
          to="/founding-fathers"
          style={{ fontSize: "0.9rem" }}
        >
          Founders
        </Link>
        <Link
          className="navlink"
          to={userConstituencyUrl}
          style={{ fontSize: "0.9rem" }}
        >
          Home
        </Link>
        <Link className="navlink" to="/elders" style={{ fontSize: "0.9rem" }}>
          Elders
        </Link>

        {/* ✅ Replaced Login → Executive Records */}
        <Link
          className="navlink text-warning fw-bold"
          to="/all-executive-records-ndc"
          style={{ fontSize: "0.9rem" }}
        >
          📊 Executive Records
        </Link>

        {/* ✅ Logout stays at the end */}
        {isAuthenticated && (
          <button
            className="navbtn"
            onClick={handleLogout}
            style={{
              fontSize: "0.9rem",
              backgroundColor: "#E71D36",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "0.25rem 0.7rem",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        )}

        {/* ✅ Admin-only links */}
        {user?.role === "executive" && (
          <>
            <Link
              className="navlink admin"
              to="/donate/admin"
              style={{ fontSize: "0.9rem" }}
            >
              📋 All Donations
            </Link>
            <Link
              className="navlink admin"
              to="/admin/blog"
              style={{ fontSize: "0.9rem" }}
            >
              🛠️ Blog Admin
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
