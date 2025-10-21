// src/pages/Generic/PollingStationsPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import PageWithFlagBackground from "@components/Layout/PageWithFlagBackground";
import ConstituencyNavbar from "@components/Navbars/ConstituencyNavbar";
import type { User, Role } from "@api/users"; // ✅ unified import
import { G_ACCRA_POLLING_STATIONS } from "@data/pollingStations/G-Accra_PollingStations";
import { API_BASE_URL } from "@api/config";
import { resolvePhotoUrl } from "../../utils/photo"; // ✅ shared photo resolver

// ✅ Normalize helper
const norm = (s?: string) => (s || "").toLowerCase().replace(/-/g, " ").trim();

// ✅ Local type
interface LocalUser extends User {
  role: Role & {
    isActive?: boolean;
    termStart?: string;
    termEnd?: string;
    pollingStationName?: string;
  };
}
// ✅ Fixed hierarchy for polling station executives
const POLLING_HIERARCHY = [
  "Chairman",
  "Secretary",
  "Treasurer",
  "Organizer",
  "Youth Organizer",
  "Women's Organizer",
];


export default function PollingStationsPage() {
  const { region, constituency } = useParams<{ region: string; constituency: string }>();
  const [groupedStations, setGroupedStations] = useState<Record<string, LocalUser[]>>({});
  const [search, setSearch] = useState("");
  const [openStation, setOpenStation] = useState<Record<string, boolean>>({});
  const [showTop, setShowTop] = useState(false);

  // ✅ Fetch polling station executives with cache-first strategy
useEffect(() => {
  async function fetchUsers() {
    const CACHE_KEY = `polling-execs-${region}-${constituency}`;
    const cached = localStorage.getItem(CACHE_KEY);

    // 💾 Instantly show cached results
    if (cached) {
      console.log(`💾 Showing cached polling execs for ${constituency}`);
      setGroupedStations(JSON.parse(cached));
    }

    try {
      console.log(`🌐 Fetching fresh polling execs for ${constituency}...`);
      const res = await fetch(`${API_BASE_URL}/api/users`);
      const json = await res.json();
      const users: User[] = Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json)
        ? json
        : [];

      const r = norm(region);
      const c = norm(constituency);

      const pollingExecs = (users as User[])
        .filter(
          (u) =>
            norm(u.role?.unit) === "polling station executives" &&
            norm(u.region) === r &&
            norm(u.constituency) === c
        )
        .map((u) => {
          const role = u.role || {};
          const termStart = role.termStartDate || role.termStart || "";
          const termEnd = role.termEndDate || role.termEnd || "";
          const hasEnded = termEnd && new Date(termEnd).getTime() < Date.now();
          return {
            ...u,
            role: { ...role, termStart, termEnd, isActive: !hasEnded },
          } as LocalUser;
        });

      // ✅ Group by polling station
      const grouped: Record<string, LocalUser[]> = {};
      pollingExecs.forEach((u) => {
        let stationName = u.role?.pollingStationName || "UNKNOWN";

        // ✅ Map station code → readable name (Greater Accra only)
        if (norm(region) === "greater accra") {
          for (const list of Object.values(G_ACCRA_POLLING_STATIONS)) {
            const match = list.find((st) => st.code === stationName);
            if (match) {
              stationName = match.name;
              break;
            }
          }
        }

        if (!grouped[stationName]) grouped[stationName] = [];
        grouped[stationName].push(u);
      });

      // ✅ Update state + cache
      setGroupedStations(grouped);
      localStorage.setItem(CACHE_KEY, JSON.stringify(grouped));
      console.log(`✅ Updated polling execs cache for ${constituency}`);
    } catch (err) {
      console.error("❌ Failed to fetch polling station execs:", err);
    }
  }

  fetchUsers();
}, [region, constituency]);

  const getTermGroup = (user: LocalUser) => {
    const start = user.role?.termStart || user.role?.termStartDate || "";
    const end = user.role?.termEnd || user.role?.termEndDate || "";
    if (!start && !end) return "Unknown Term";
    if (!end) return `${start} – Present`;
    return `${start} – ${end}`;
  };

  return (
    <>
      <ConstituencyNavbar region={region || ""} constituency={constituency || ""} />
      <PageWithFlagBackground title={`🗳️ ${constituency} Polling Stations`}>
        <Container className="py-4">
          {/* 🔍 Search field */}
          <Form.Group className="mb-4">
            <Form.Control
              type="text"
              placeholder="Search polling station by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Form.Group>

          {Object.entries(groupedStations)
            .filter(([stationName]) =>
              stationName.toLowerCase().includes(search.toLowerCase())
            )
            .map(([stationName, stationUsers]) => {
              const current = stationUsers.filter((u) => u.role?.isActive);
              const past = stationUsers.filter((u) => !u.role?.isActive);

              const pastGroups: Record<string, LocalUser[]> = {};
              past.forEach((user) => {
                const term = getTermGroup(user);
                if (!pastGroups[term]) pastGroups[term] = [];
                pastGroups[term].push(user);
              });

              return (
                <Card key={stationName} className="mb-4 shadow-sm">
                  <Card.Header
                    className="fw-bold bg-primary text-white"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      setOpenStation((prev) => ({
                        ...prev,
                        [stationName]: !prev[stationName],
                      }))
                    }
                  >
                    {stationName}
                  </Card.Header>

                  {openStation[stationName] && (
                    <Card.Body>
                      {/* 🌟 Current Executives */}
                      {current.length > 0 && (
                        <>
                          <h5 className="text-success mb-3">🌟 Current Executives</h5>
                          <div className="executives-grid">
                            {[...current]
                              .sort((a, b) => {
                                const posA = POLLING_HIERARCHY.indexOf(a.role?.position || "");
                                const posB = POLLING_HIERARCHY.indexOf(b.role?.position || "");
                                // If any role not found, push it to bottom
                                return (posA === -1 ? 999 : posA) - (posB === -1 ? 999 : posB);
                              })
                              .map((user) => (

                              <Col xs={6} md={3} key={user._id}>
                                <div className="executive-card h-100">
                                  <img
                                    src={resolvePhotoUrl(user.photo, API_BASE_URL)}
                                    alt={user.name || "Executive"}
                                    className="executive-image"
                                    onError={(e) => {
                                      (e.currentTarget as HTMLImageElement).src =
                                        "/No Image Available.png";
                                    }}
                                  />
                                  <div className="executive-name">
                                    {user.name || "Unnamed"}
                                  </div>
                                  <div className="executive-position">
                                    {user.role?.position || "—"}
                                  </div>
                                  <div className="executive-term">
                                    {user.role?.termStart || "?"} –{" "}
                                    {user.role?.termEnd || "Present"}
                                  </div>
                                  <div className="executive-status text-success fw-bold">
                                    Current
                                  </div>
                                </div>
                              </Col>
                            ))}
                          </div>
                        </>
                      )}

                      {/* 🕰 Past Executives */}
                      {Object.entries(pastGroups).length > 0 && (
                        <>
                          <h5 className="text-secondary mb-3">🕰 Past Executives</h5>
                          {Object.entries(pastGroups).map(([term, users]) => (
                            <div key={term} className="mb-4">
                              <h6 className="fw-bold text-dark bg-light p-2 rounded">
                                {term}
                              </h6>
                              <Row className="g-4 justify-content-center">
                                {[...users]
                                  .sort((a, b) => {
                                  const posA = POLLING_HIERARCHY.indexOf(a.role?.position || "");
                                  const posB = POLLING_HIERARCHY.indexOf(b.role?.position || "");
                                  return (posA === -1 ? 999 : posA) - (posB === -1 ? 999 : posB);
                                })
                                .map((user) => (

                                  <Col xs={6} md={3} key={user._id}>
                                    <div
                                      className="executive-card h-100"
                                      style={{ backgroundColor: "#f1f1f1" }}
                                    >
                                      <img
                                        src={resolvePhotoUrl(user.photo, API_BASE_URL)}
                                        alt={user.name || "Executive"}
                                        className="executive-image"
                                        onError={(e) => {
                                          (e.currentTarget as HTMLImageElement).src =
                                            "/No Image Available.png";
                                        }}
                                      />
                                      <div className="executive-name">
                                        {user.name || "Unnamed"}
                                      </div>
                                      <div className="executive-position">
                                        {user.role?.position || "—"}
                                      </div>
                                      <div className="executive-term">
                                        {user.role?.termStart || "?"} –{" "}
                                        {user.role?.termEnd || "?"}
                                      </div>
                                      <div className="executive-status text-muted fw-bold">
                                        Past
                                      </div>
                                    </div>
                                  </Col>
                                ))}
                              </Row>
                            </div>
                          ))}
                        </>
                      )}
                    </Card.Body>
                  )}
                </Card>
              );
            })}
        </Container>

        {/* ⬆ Back to Top */}
        {showTop && (
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              position: "fixed",
              bottom: 20,
              right: 20,
              borderRadius: "50%",
              padding: "10px 15px",
              zIndex: 1000,
            }}
            variant="primary"
          >
            ⬆
          </Button>
        )}
      </PageWithFlagBackground>
    </>
  );
}
