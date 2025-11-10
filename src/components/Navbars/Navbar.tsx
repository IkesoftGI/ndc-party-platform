// src/components/Navbars/Navbar.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import umbrellaIcon from "@assets/NDC.png"; // ✅ NDC umbrella logo
import { useAuth } from "../../context/AuthContext";
import type { User } from "../../types/User";

export default function Navbar() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // ✅ User home URL
  const storedUserStr = localStorage.getItem("lastUser");
  const storedUser = storedUserStr ? (JSON.parse(storedUserStr) as User) : null;
  const userConstituencyUrl = storedUser
    ? `/regions/${storedUser.region.toLowerCase().replace(/\s+/g, "-")}/constituencies/${storedUser.constituency
        .toLowerCase()
        .replace(/\s+/g, "-")}`
    : "/dashboard";

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        background: "linear-gradient(90deg, #00843D 0%, #E71D36 50%, #000000 100%)",
      }}
    >
      <div className="container-fluid">
        {/* ✅ Logo + Brand */}
        <Link className="navbar-brand d-flex align-items-center text-light" to="/">
          <img
            src={umbrellaIcon}
            alt="NDC Umbrella Logo"
            width="40"
            height="40"
            className="me-2"
            style={{
              borderRadius: "8px",
              backgroundColor: "white",
              padding: "3px",
            }}
          />
          <span className="fw-bold" style={{ fontSize: "1.1rem" }}>
            NDC Party Platform
          </span>
        </Link>

        {/* ✅ Toggle for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          style={{ borderColor: "#ffffff" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* ✅ Links */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto" style={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}>
            {/* Headquarters */}
            <li className="nav-item">
              <Link className="nav-link text-light" to="/nhqt">
                HQ
              </Link>
            </li>

            {/* Static links */}
            <li className="nav-item">
              <Link className="nav-link text-light" to="/presidents">
                Presidents
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/founding-fathers">
                Founders
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/executives">
                Executives
              </Link>
            </li>

            {/* ✅ Replaced Login → Executive Records */}
            <li className="nav-item">
              <Link className="nav-link text-warning fw-bold" to="/all-executive-records-ndc">
                📊 Executive Records
              </Link>
            </li>

            {/* Logout */}
            {user && (
              <li className="nav-item">
                <Link className="nav-link text-danger fw-bold" to="/logout">
                  Logout
                </Link>
              </li>
            )}

            {/* ✅ Home */}
            {user && (
              <li className="nav-item">
                <Link className="nav-link text-light" to={userConstituencyUrl}>
                  Home
                </Link>
              </li>
            )}

            {/* ✅ Admin-only */}
            {user?.role === "executive" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-warning fw-bold" to="/donate/admin">
                    📋 All Donations
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-warning fw-bold" to="/admin/blog">
                    🛠️ Blog Admin
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
