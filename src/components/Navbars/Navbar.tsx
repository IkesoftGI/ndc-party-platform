// src/components/Navbars/Navbar.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import elephantIcon from "@assets/elephant-icon.webp";
import { useAuth } from "../../context/AuthContext";
import type { User } from "../../types/User";

export default function Navbar() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Dynamically generate user's constituency URL for generic Home button
  const storedUserStr = localStorage.getItem("lastUser");
const storedUser = storedUserStr ? JSON.parse(storedUserStr) as User : null;
const userConstituencyUrl = storedUser
  ? `/regions/${storedUser.region.toLowerCase().replace(/\s+/g, "-")}/constituencies/${storedUser.constituency.toLowerCase().replace(/\s+/g, "-")}`
  : "/dashboard";


  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        {/* Logo + Brand */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={elephantIcon}
            alt="Elephant Icon"
            width="40"
            height="40"
            className="me-2"
          />
          <span className="fw-bold">NPP Party Platform</span>
        </Link>

        {/* Toggle button for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible links */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto" style={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}>
            {/* National Headquarters */}
            <li className="nav-item">
              <Link className="nav-link" to="/nhqt">NHQT</Link>
            </li>

            {/* Other links */}
            <li className="nav-item">
              <Link className="nav-link" to="/presidents">Presidents</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/founding-fathers">Founding Fathers</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/executives">Executives</Link>
            </li>

            {/* Login / Logout */}
            {user ? (
              <li className="nav-item">
                <Link className="nav-link" to="/logout">Logout</Link>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            )}

            {/* ✅ Generic Home button (last in the list, replaces Donate) */}
            {user && (
              <li className="nav-item">
                <Link className="nav-link" to={userConstituencyUrl}>Home</Link>
              </li>
            )}

            {/* Admin-only links */}
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
