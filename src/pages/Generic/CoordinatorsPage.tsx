// src/pages/Generic/CoordinatorsPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import PageWithFlagBackground from "@components/Layout/PageWithFlagBackground";
import ConstituencyNavbar from "@components/Navbars/ConstituencyNavbar";
import type { User, Role } from "@api/users"; // ✅ unified import
import "@pages/Presidents.css";
import { API_BASE_URL } from "@api/config";
import { resolvePhotoUrl } from "../../utils/photo"; // ✅ shared resolver

// ✅ Normalize helper
const norm = (s?: string) => (s || "").toLowerCase().replace(/-/g, " ").trim();

// ✅ Local extension
interface LocalUser extends User {
  role: Role & {
    isActive?: boolean;
    termStart?: string;
    termEnd?: string;
    electoralAreaName?: string;
  };
}

// ✅ Fixed hierarchy for Electoral Area Coordinators
const COORDINATOR_HIERARCHY = [
  "Chairman",
  "Vice Chairman",
  "Secretary",
  "Deputy Secretary",
  "Organizer",
  "Deputy Organizer",
  "Youth Organizer",
  "Deputy Youth Organizer",
  "Women's Organizer",
  "Deputy Women's Organizer",
  "Treasurer",
  "Deputy Treasurer",
  "Nasara Coordinator",
  "Deputy Nasara Coordinator",
];


export default function CoordinatorsPage() {
  const { region, constituency } = useParams<{ region: string; constituency: string }>();

  const [groupedAreas, setGroupedAreas] = useState<Record<string, LocalUser[]>>({});
  const [search, setSearch] = useState("");
  const [openArea, setOpenArea] = useState<Record<string, boolean>>({});
  const [showTop, setShowTop] = useState(false);

  // ✅ Fetch coordinators with cache-first strategy
useEffect(() => {
  async function fetchUsers() {
    const CACHE_KEY = `coordinators-${region}-${constituency}`;
    const cached = localStorage.getItem(CACHE_KEY);

    // 💾 Instantly show cached results if available
    if (cached) {
      console.log(`💾 Showing cached coordinators for ${constituency}`);
      setGroupedAreas(JSON.parse(cached));
    }

    try {
      console.log(`🌐 Fetching fresh coordinators for ${constituency}...`);
      const res = await fetch(`${API_BASE_URL}/api/users`);
      const json = await res.json();
      const users: User[] = Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json)
        ? json
        : [];

      const r = norm(region);
      const c = norm(constituency);

      const coordinators = (users as User[])
        .filter(
          (u) =>
            norm(u.role?.unit) === "electoral area coordinators" &&
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

      // ✅ Group by electoral area
      const grouped: Record<string, LocalUser[]> = {};
      coordinators.forEach((u) => {
        const area = u.role?.electoralAreaName || "Unknown Area";
        if (!grouped[area]) grouped[area] = [];
        grouped[area].push(u);
      });

      // ✅ Update UI + cache
      setGroupedAreas(grouped);
      localStorage.setItem(CACHE_KEY, JSON.stringify(grouped));
      console.log(`✅ Updated coordinators cache for ${constituency}`);
    } catch (err) {
      console.error("❌ Failed to fetch coordinators:", err);
    }
  }

  fetchUsers();
}, [region, constituency]);

  return (
    <>
      <ConstituencyNavbar region={region || ""} constituency={constituency || ""} />
      <PageWithFlagBackground title={`🗳️ Electoral Area Coordinators - ${constituency}`}>
        <div style={{ backgroundColor: "#486f94ff", minHeight: "100vh" }}>
          <Container className="py-4">
            {/* 🔍 Search bar */}
            <Form.Group className="mb-4">
              <Form.Control
                type="text"
                placeholder="Search electoral area by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Form.Group>

            {Object.entries(groupedAreas)
              .filter(([area]) => area.toLowerCase().includes(search.toLowerCase()))
              .map(([area, areaUsers]) => {
                const current = areaUsers
                  .filter((u) => u.role?.isActive)
                  .sort((a, b) => {
                    const posA = COORDINATOR_HIERARCHY.indexOf(a.role?.position || "");
                    const posB = COORDINATOR_HIERARCHY.indexOf(b.role?.position || "");
                    if (posA === -1 && posB === -1) return (a.name || "").localeCompare(b.name || "");
                    if (posA === -1) return 1;
                    if (posB === -1) return -1;
                    return posA - posB;
                  });

                const past = areaUsers
                  .filter((u) => !u.role?.isActive)
                  .sort((a, b) => {
                    const posA = COORDINATOR_HIERARCHY.indexOf(a.role?.position || "");
                    const posB = COORDINATOR_HIERARCHY.indexOf(b.role?.position || "");
                    if (posA === -1 && posB === -1) return (a.name || "").localeCompare(b.name || "");
                    if (posA === -1) return 1;
                    if (posB === -1) return -1;
                    return posA - posB;
                  });


                return (
                  <div key={area} className="mb-5">
                    {/* Electoral Area Header */}
                    <h2
                      className="fw-bold text-light p-2 rounded mb-4"
                      style={{ backgroundColor: "#0d6efd", cursor: "pointer" }}
                      onClick={() =>
                        setOpenArea((prev) => ({
                          ...prev,
                          [area]: !prev[area],
                        }))
                      }
                    >
                      {area}
                    </h2>

                    {openArea[area] && (
                      <>
                        {/* 🌟 Current Coordinators */}
                        {current.length > 0 && (
                          <div className="mb-5">
                            <h2
                              className="fw-bold text-light p-2 rounded mb-4"
                              style={{ backgroundColor: "#198754" }}
                            >
                              🌟 Current Coordinators
                            </h2>
                            <Row className="g-4 justify-content-center">
                              {current.map((user) => (
                                <Col xs={12} sm={6} md={4} key={user._id}>
                                  <div className="executive-card h-100">
                                    <img
                                      src={resolvePhotoUrl(user.photo, API_BASE_URL)}
                                      alt={user.name || "Coordinator"}
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
                                    {(user.role?.termStart || user.role?.termEnd) && (
                                      <div className="executive-term">
                                        {user.role?.termStart || "?"} –{" "}
                                        {user.role?.termEnd || "Present"}
                                      </div>
                                    )}
                                    <div className="executive-status text-success fw-bold">
                                      Current
                                    </div>
                                  </div>
                                </Col>
                              ))}
                            </Row>
                          </div>
                        )}

                        {/* Divider */}
                        {current.length > 0 && past.length > 0 && <hr className="my-5" />}

                        {/* 🕰 Past Coordinators */}
                        {past.length > 0 && (
                          <div className="mb-5">
                            <h2
                              className="fw-bold text-light p-2 rounded mb-4"
                              style={{ backgroundColor: "#3d6180ff" }}
                            >
                              🕰 Past Coordinators
                            </h2>
                            <Row className="g-4 justify-content-center">
                              {past.map((user) => (
                                <Col xs={12} sm={6} md={4} key={user._id}>
                                  <div
                                    className="executive-card h-100"
                                    style={{ backgroundColor: "#f1f1f1" }}
                                  >
                                    <img
                                      src={resolvePhotoUrl(user.photo, API_BASE_URL)}
                                      alt={user.name || "Coordinator"}
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
                                    {(user.role?.termStart || user.role?.termEnd) && (
                                      <div className="executive-term">
                                        {user.role?.termStart || "?"} –{" "}
                                        {user.role?.termEnd || "?"}
                                      </div>
                                    )}
                                    <div className="executive-status text-muted fw-bold">
                                      Past
                                    </div>
                                  </div>
                                </Col>
                              ))}
                            </Row>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
          </Container>

          {/* ✅ Back to Top Button */}
          {showTop && (
            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                borderRadius: "50%",
                padding: "10px 15px",
                zIndex: 1000,
              }}
              variant="primary"
            >
              ⬆
            </Button>
          )}
        </div>
      </PageWithFlagBackground>
    </>
  );
}
