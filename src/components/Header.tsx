// src/components/Header.tsx
import { Link, useNavigate } from "react-router-dom";
import partyLogo from "@assets/logo/party-platform-logo.png"; // ✅ New Logo
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

  // ✅ User constituency URL for Home button
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
        backgroundColor: "#002868",
        color: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
          src={partyLogo}
          alt="NPP Party Platform Logo"
          style={{
            width: 42,
            height: 42,
            borderRadius: "8px",
            backgroundColor: "white",
            padding: "3px",
          }}
        />
        <h1 style={{ fontSize: "1.25rem", margin: 0, fontWeight: 700 }}>
          NPP Party Platform
        </h1>
      </div>

      {/* Navigation links */}
      <nav
        className="nav-scroller"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          padding: "0.4rem 1rem 0.6rem",
          flexWrap: "nowrap",
          overflowX: "auto",
        }}
      >
        {/* National Headquarters */}
        <Link className="navlink" to="/nhqt" style={{ fontSize: "0.9rem" }}>
          NHQT
        </Link>

        {/* Other links */}
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
          Fathers
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

        {/* Login / Logout */}
        {isAuthenticated ? (
          <button
            className="navbtn"
            onClick={handleLogout}
            style={{ fontSize: "0.9rem" }}
          >
            Logout
          </button>
        ) : (
          <Link className="navlink" to="/login" style={{ fontSize: "0.9rem" }}>
            Login
          </Link>
        )}

        {/* Admin-only links */}
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
