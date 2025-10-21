// src/components/Navbar.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">🐘 NPP</Link>

        {/* Toggle Button for Small Screens */}
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

        {/* Collapsible Links */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/presidents">Presidents</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/executives">Executives</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/blog">Blog</Link>
            </li>
            {user?.role === "executive" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-warning fw-bold" to="/donate/admin">
                    📋 All Donations (Admin View)
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-warning fw-bold" to="/admin/blog">
                    🛠️ Admin Blog Dashboard
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/elders">Council of Elders</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/donate">Donate</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
