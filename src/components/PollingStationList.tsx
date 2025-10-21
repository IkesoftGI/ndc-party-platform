// src\components\PollingStationList.tsx

import { ALL_POLLING_STATIONS } from "@data/pollingStations";
import type { PollingStation } from "../types/pollingStations";

interface PollingStationListProps {
  region: keyof typeof ALL_POLLING_STATIONS;  // e.g. "WESTERN", "EASTERN"
  constituency: string;                       // e.g. "Sekondi", "Bantama"
}

export default function PollingStationList({ region, constituency }: PollingStationListProps) {
  const regionData = ALL_POLLING_STATIONS[region];
  const pollingStations: PollingStation[] = regionData[constituency] || [];

  if (!pollingStations.length) {
    return (
      <div className="alert alert-warning">
        No polling stations found for <b>{constituency}</b> in <b>{region}</b>.
      </div>
    );
  }

  return (
    <div className="card shadow-sm p-3">
      <h4 className="mb-3">
        {constituency} Constituency — {region} Region
      </h4>
      <ul className="list-group">
        {pollingStations.map((station) => (
          <li key={station.code} className="list-group-item">
            <strong>{station.code}</strong> — {station.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
