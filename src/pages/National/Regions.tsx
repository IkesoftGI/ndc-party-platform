// src/pages/Regions.tsx
import { Link } from "react-router-dom";

const regions = [
  "Ahafo", "Ashanti", "Bono", "Bono East", "Central", "Eastern",
  "Greater Accra", "North East", "Northern", "Oti", "Savannah",
  "Upper East", "Upper West", "Volta", "Western", "Western North"
];

export default function Regions() {
  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">🗺️ Explore Regions</h2>
      <div className="row">
        {regions.map((region) => (
          <div className="col-md-4 mb-3" key={region}>
            <Link to={`/regions/${region.toLowerCase().replace(/ /g, "-")}`} className="btn btn-outline-primary w-100 text-center">
              {region}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
