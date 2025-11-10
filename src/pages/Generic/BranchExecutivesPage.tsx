// src/pages/Generic/BranchExecutivesPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import PageWithFlagBackground from "@components/Layout/PageWithFlagBackground";
import ConstituencyNavbar from "@components/Navbars/ConstituencyNavbar";
import type { User, Role } from "@api/users";
import { G_ACCRA_POLLING_STATIONS } from "@data/pollingStations/G-Accra_PollingStations";
import { API_BASE_URL } from "@api/config";
import { resolvePhotoUrl } from "../../utils/photo";
import "@pages/Presidents.css";

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

// ✅ Branch Hierarchy
const BRANCH_HIERARCHY = [
  "Chairman",
  "Secretary",
  "Treasurer",
  "Organizer",
  "Communication Officer",
  "Youth Organizer",
  "Women's Organizer",
  "Executive Member (1)",
  "Executive Member (2)",
];

export default function BranchExecutivesPage() {
  const { region, constituency } = useParams<{ region: string; constituency: string }>();
  const [groupedStations, setGroupedStations] = useState<Record<string, LocalUser[]>>({});
  const [search, setSearch] = useState("");
  const [openStation, setOpenStation] = useState<Record<string, boolean>>({});
  const [showTop, setShowTop] = useState(false);

  // ✅ Fetch branch executives with cache-first strategy
  useEffect(() => {
    async function fetchUsers() {
      const CACHE_KEY = `branch-execs-${region}-${constituency}`;
      const cached = localStorage.getItem(CACHE_KEY);

      if (cached) {
        console.log(`💾 Showing cached branch execs for ${constituency}`);
        setGroupedStations(JSON.parse(cached));
      }

      try {
        console.log(`🌐 Fetching fresh branch execs for ${constituency}...`);
        const res = await fetch(`${API_BASE_URL}/api/users`);
        const json = await res.json();
        const users: User[] = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : [];

        const r = norm(region);
        const c = norm(constituency);

        const branchExecs = users
          .filter(
            (u) =>
              norm(u.role?.unit) === "branch executives" &&
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

        // ✅ Group by polling station / branch
        const grouped: Record<string, LocalUser[]> = {};
        branchExecs.forEach((u) => {
          let stationName = u.role?.pollingStationName || "UNKNOWN";

          // Translate Greater Accra polling codes to names
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
        console.log(`✅ Updated branch execs cache for ${constituency}`);
      } catch (err) {
        console.error("❌ Failed to fetch branch execs:", err);
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

  // ✅ Scroll listener for Back-to-Top button
  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <ConstituencyNavbar region={region || ""} constituency={constituency || ""} />
      <PageWithFlagBackground title={`🗳️ Branch Executives - ${constituency}`}>
        <Container className="py-4 mt-3">
          {/* 🔍 Search field */}
          <Form.Group className="mb-4">
            <Form.Control
              type="text"
              placeholder="Search branch by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Form.Group>

          {/* 🔁 Render all grouped branches */}
          {Object.entries(groupedStations)
            .filter(([stationName]) =>
              stationName.toLowerCase().includes(search.toLowerCase())
            )
            .map(([stationName, stationUsers]) => {
              const current = stationUsers.filter((u) => u.role?.isActive);
              const past = stationUsers.filter((u) => !u.role?.isActive);

              // Group past executives by term period
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
                    <div className="d-flex justify-content-between align-items-center">
                      <span>{stationName}</span>
                      <span className="small">
                        🌍 Total: {stationUsers.length} | ✅ Current: {current.length} | 🕰 Past:{" "}
                        {past.length}
                      </span>
                    </div>
                  </Card.Header>

                  {openStation[stationName] && (
                    <Card.Body>
                      {/* 🌟 Current Executives */}
                      {current.length > 0 && (
                        <>
                          <h5
                            className="fw-bold text-light p-2 rounded mb-4"
                            style={{ backgroundColor: "#198754" }}
                          >
                            🌟 Current Executives ({current.length})
                          </h5>
                          <Row className="g-4 justify-content-center">
                            {[...current]
                              .sort((a, b) => {
                                const posA = BRANCH_HIERARCHY.indexOf(a.role?.position || "");
                                const posB = BRANCH_HIERARCHY.indexOf(b.role?.position || "");
                                return (posA === -1 ? 999 : posA) - (posB === -1 ? 999 : posB);
                              })
                              .map((user) => (
                                <Col xs={12} sm={6} md={4} key={user._id}>
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
                          </Row>
                        </>
                      )}

                      {/* 🕰 Past Executives */}
                      {Object.entries(pastGroups).length > 0 && (
                        <>
                          <h5
                            className="fw-bold text-light p-2 rounded mb-4"
                            style={{ backgroundColor: "#6c757d" }}
                          >
                            🕰 Past Executives ({past.length})
                          </h5>
                          {Object.entries(pastGroups).map(([term, users]) => (
                            <div key={term} className="mb-4">
                              <h6 className="fw-bold text-dark bg-light p-2 rounded">
                                {term}
                              </h6>
                              <Row className="g-4 justify-content-center">
                                {[...users]
                                  .sort((a, b) => {
                                    const posA = BRANCH_HIERARCHY.indexOf(a.role?.position || "");
                                    const posB = BRANCH_HIERARCHY.indexOf(b.role?.position || "");
                                    return (posA === -1 ? 999 : posA) - (posB === -1 ? 999 : posB);
                                  })
                                  .map((user) => (
                                    <Col xs={12} sm={6} md={4} key={user._id}>
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

                      {/* 🪶 No Data */}
                      {current.length === 0 && past.length === 0 && (
                        <p className="text-center text-muted">
                          No branch executives found for this branch.
                        </p>
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
