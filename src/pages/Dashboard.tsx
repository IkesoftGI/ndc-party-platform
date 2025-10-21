// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import elephantIcon from "@assets/elephant-icon.webp";

export default function Dashboard() {
  const [backendStatus, setBackendStatus] = useState<"checking" | "ok" | "error">("checking");
  const [fadeOut, setFadeOut] = useState(false);

  // ✅ Non-blocking backend ping
  useEffect(() => {
    const apiBase =
      import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL;
    console.log("🔎 Checking backend connection at:", apiBase);

    axios
      .get(`${apiBase?.replace(/\/$/, "")}/health`, { timeout: 3000 })
      .then((res) => {
        if (res.data?.ok) setBackendStatus("ok");
        else setBackendStatus("error");
      })
      .catch(() => setBackendStatus("error"));

    const hideTimer = setTimeout(() => setFadeOut(true), 4000);
    return () => clearTimeout(hideTimer);
  }, []);

  return (
    <div className="dashboard text-center py-5">
      {/* ✅ Backend status (does NOT block rendering) */}
      {backendStatus === "ok" && !fadeOut && (
        <div className="text-center py-2 bg-success text-white fw-bold">
          ✅ Connected to Live Backend ({import.meta.env.VITE_BACKEND_URL})
        </div>
      )}
      {backendStatus === "error" && (
        <div className="text-center py-2 bg-danger text-white fw-bold">
          ❌ Could not reach backend — please check Render service.
        </div>
      )}

      {/* 🐘 Logo & Welcome */}
      <img src={elephantIcon} alt="NPP Elephant Logo" style={{ width: 150 }} />
      <h1 className="mt-3">Welcome To New Patriotic Party Platform</h1>
      <p className="lead">Explore the pages below</p>

      {/* ✅ Distinct buttons with correct routes */}
      <div className="dashboard-buttons mt-4 d-flex justify-content-center gap-3 flex-wrap">
        <Link to="/regions" className="btn btn-primary btn-lg">
          🌍 Explore 16 Regions
        </Link>
        <Link to="/national-home" className="btn btn-success btn-lg">
          🏛️ National Headquarters
        </Link>
        <Link to="/national-executives" className="btn btn-warning btn-lg">
          👔 National Executives
        </Link>
        <Link to="/constituency-home" className="btn btn-info btn-lg">
          🏠 My Constituency
        </Link>
      </div>
    </div>
  );
}
