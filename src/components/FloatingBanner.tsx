// src/components/FloatingBanner.tsx
import { Link } from "react-router-dom";
import "./FloatingBanner.css";

export default function FloatingBanner() {
  return (
    <div className="floating-banner">
      <Link to="/events" className="btn btn-warning fw-bold">
        📅 Join Our Next Event
      </Link>
    </div>
  );
}
