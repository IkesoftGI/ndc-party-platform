// src/components/Cards/ExecutiveCard.tsx
import type { User } from "../../types/User";
import { API_BASE_URL } from "@api/config"; // ✅ Use dynamic backend URL

// ✅ Term fallback helpers
const pickTermStart = (u: User) =>
  u.role?.termStartDate ?? u.role?.termStart ?? "";
const pickTermEnd = (u: User) =>
  u.role?.termEndDate ?? u.role?.termEnd ?? "";

// ✅ Compute active status (consistent with self-placement logic)
const computeIsActive = (u: User) => {
  const explicitTrue =
    u.role?.isActive === true ||
    String(u.role?.isActive ?? "").toLowerCase() === "true";

  const termEnd = pickTermEnd(u);
  const ended = !!termEnd && new Date(termEnd).getTime() < Date.now();

  return explicitTrue && !ended;
};

interface Props {
  executive: User;
}

export default function ExecutiveCard({ executive }: Props) {
  const isActive = computeIsActive(executive);

  return (
    <div className="executive-card shadow-sm text-center">
      <img
        src={
          executive.photo
            ? `${API_BASE_URL}/uploads/${executive.photo}` // ✅ Dynamic backend URL
            : "/No Image Available.png"
        }
        alt={executive.name || "Unnamed Executive"}
        className="executive-image mb-1"
        style={{
          height: "200px",
          objectFit: "cover",
          opacity: isActive ? 1 : 0.6,
        }}
      />

      <div className="executive-name fw-bold">
        {executive.name || "Unnamed"}
      </div>
      <div className="executive-position text-muted mb-1">
        {executive.role?.position || "Unknown Position"}
      </div>

      {/* ✅ Polling Station / Electoral Area display */}
      {executive.role?.pollingStationName && (
        <div className="executive-extra text-info">
          Polling Station: {executive.role.pollingStationName}
        </div>
      )}
      {executive.role?.electoralAreaName && (
        <div className="executive-extra text-info">
          Electoral Area: {executive.role.electoralAreaName}
        </div>
      )}

      {/* ✅ Term Display */}
      {(pickTermStart(executive) || pickTermEnd(executive)) && (
        <div className="executive-term mb-1">
          Term:{" "}
          {pickTermStart(executive)
            ? new Date(pickTermStart(executive)).toLocaleDateString()
            : "—"}{" "}
          –{" "}
          {pickTermEnd(executive)
            ? new Date(pickTermEnd(executive)).toLocaleDateString()
            : isActive
            ? "Present"
            : "—"}
        </div>
      )}

      {/* ✅ Status Label */}
      <div className={`fw-bold ${isActive ? "text-success" : "text-secondary"}`}>
        {isActive ? "Current" : "Past"}
      </div>
    </div>
  );
}
