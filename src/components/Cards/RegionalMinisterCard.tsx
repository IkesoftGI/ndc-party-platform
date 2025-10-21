// src/components/Cards/RegionalMinisterCard.tsx

import type { RegionalMinister } from "@data/regionalMinisters";

export default function RegionalMinisterCard({ minister }: { minister: RegionalMinister }) {
  const onImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src = "/No Image Available.png"; // ✅ Ensure this file exists
  };

  return (
    <div className="card shadow-sm mb-4">
      <img
        src={minister.photo}
        onError={onImgError}
        className="card-img-top"
        alt={minister.name || "Regional Minister"}
        style={{
          height: "300px",
          width: "100%",
          objectFit: "cover",
        }}
      />
      <div className="card-body">
        <h5 className="card-title">{minister.name}</h5>
        <p className="card-text text-muted">{minister.status}</p>
        <p className="card-text">{minister.term}</p>
        {minister.bio && <p className="card-text text-muted">{minister.bio}</p>}
      </div>
    </div>
  );
}
