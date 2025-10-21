// src/pages/PollingStationViewer.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ExecutiveCard from "@components/Cards/ExecutiveCard";
import type { User } from "../types/User";
import { pollingStationExecutives } from "@data/pollingStationExecutives";

const PollingStationViewer: React.FC = () => {
  const { pollingStationId } = useParams<{ pollingStationId: string }>();
  const [executives, setExecutives] = useState<User[]>([]);

  useEffect(() => {
    if (pollingStationId) {
      const data = pollingStationExecutives[pollingStationId] || [];
      setExecutives(data);
    }
  }, [pollingStationId]);

  return (
    <div className="container mt-4">
      <h2>Polling Station Executives</h2>
      <div className="row">
        {executives.length > 0 ? (
          executives.map((exec) => (
            <div className="col-md-4 mb-4" key={exec._id}>
              <ExecutiveCard executive={exec} />
            </div>
          ))
        ) : (
          <div className="col-12">
            <p>No executives found for this polling station.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollingStationViewer;
