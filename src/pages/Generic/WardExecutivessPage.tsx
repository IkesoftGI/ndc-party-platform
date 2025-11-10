// src/pages/Generic/WardExecutivesPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import PageWithFlagBackground from "@components/Layout/PageWithFlagBackground";
import ConstituencyNavbar from "@components/Navbars/ConstituencyNavbar";
import type { User, Role } from "@api/users";
import "@pages/Presidents.css";
import { API_BASE_URL } from "@api/config";
import { resolvePhotoUrl } from "../../utils/photo";

// ✅ Normalize helper
const norm = (s?: string) => (s || "").toLowerCase().replace(/-/g, " ").trim();

// ✅ Local type
interface LocalUser extends User {
  role: Role & {
    isActive?: boolean;
    termStart?: string;
    termEnd?: string;
    electoralAreaName?: string;
  };
}

// ✅ Ward hierarchy
const WARDEXECUTIVES_HIERARCHY = [
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

export default function WardExecutivesPage() {
  const { region, constituency } = useParams<{ region: string; constituency: string }>();
  const [groupedAreas, setGroupedAreas] = useState<Record<string, LocalUser[]>>({});
  const [search, setSearch] = useState("");
  const [openArea, setOpenArea] = useState<Record<string, boolean>>({});
  const [showTop, setShowTop] = useState(false);

  // ✅ Fetch ward executives (cache-first)
  useEffect(() => {
    async function fetchUsers() {
      const CACHE_KEY = `ward-executives-${region}-${constituency}`;
      const cached = localStorage.getItem(CACHE_KEY);

      if (cached) {
        console.log(`💾 Showing cached ward executives for ${constituency}`);
        setGroupedAreas(JSON.parse(cached));
      }

      try {
        console.log(`🌐 Fetching fresh ward executives for ${constituency}...`);
        const res = await fetch(`${API_BASE_URL}/api/users`);
        const json = await res.json();
        const users: User[] = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : [];

        const r = norm(region);
        const c = norm(constituency);

        const wardExecs = users
          .filter(
            (u) =>
              norm(u.role?.unit) === "ward executives" &&
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

        // ✅ Group by ward/electoral area
        const grouped: Record<string, LocalUser[]> = {};
        wardExecs.forEach((u) => {
          const area = u.role?.electoralAreaName || "Unknown Ward";
          if (!grouped[area]) grouped[area] = [];
          grouped[area].push(u);
        });

        setGroupedAreas(grouped);
        localStorage.setItem(CACHE_KEY, JSON.stringify(grouped));
        console.log(`✅ Updated ward executives cache for ${constituency}`);
      } catch (err) {
        console.error("❌ Failed to fetch ward executives:", err);
      }
    }

    fetchUsers();
  }, [region, constituency]);

  // ✅ Scroll listener for Back-to-Top
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <ConstituencyNavbar region={region || ""} constituency={constituency || ""} />
      <PageWithFlagBackground title={`🗳️ Ward Executives - ${constituency}`}>
        <div style={{ backgroundColor: "#486f94ff", minHeight: "100vh" }}>
          <Container className="py-4">
            {/* 🔍 Search bar */}
            <Form.Group className="mb-4">
              <Form.Control
                type="text"
                placeholder="Search ward by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Form.Group>

            {/* 🔄 Iterate over wards */}
            {Object.entries(groupedAreas)
              .filter(([area]) => area.toLowerCase().includes(search.toLowerCase()))
              .map(([area, areaUsers]) => {
                const current = areaUsers
                  .filter((u) => u.role?.isActive)
                  .sort(
                    (a, b) =>
                      WARDEXECUTIVES_HIERARCHY.indexOf(a.role?.position || "") -
                      WARDEXECUTIVES_HIERARCHY.indexOf(b.role?.position || "")
                  );

                const past = areaUsers
                  .filter((u) => !u.role?.isActive)
                  .sort(
                    (a, b) =>
                      WARDEXECUTIVES_HIERARCHY.indexOf(a.role?.position || "") -
                      WARDEXECUTIVES_HIERARCHY.indexOf(b.role?.position || "")
                  );

                const total = areaUsers.length;

                return (
                  <div key={area} className="mb-5">
                    {/* 🏷 Ward Header + Counter */}
                    <div
                      onClick={() =>
                        setOpenArea((prev) => ({
                          ...prev,
                          [area]: !prev[area],
                        }))
                      }
                      className="rounded p-3 mb-3 text-light fw-bold"
                      style={{
                        background: openArea[area]
                          ? "linear-gradient(90deg, #0d6efd, #003c82)"
                          : "#0d6efd",
                        cursor: "pointer",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{area}</span>
                        <span className="small">
                          🌍 Total: {total} | ✅ Current: {current.length} | 🕰 Past: {past.length}
                        </span>
                      </div>
                    </div>

                    {openArea[area] && (
                      <>
                        {/* 🌟 Current Ward Executives */}
                        {current.length > 0 && (
                          <div className="mb-5">
                            <h4
                              className="fw-bold text-light p-2 rounded mb-4"
                              style={{ backgroundColor: "#198754" }}
                            >
                              🌟 Current Ward Executives ({current.length})
                            </h4>
                            <Row className="g-4 justify-content-center">
                              {current.map((user) => (
                                <Col xs={12} sm={6} md={4} key={user._id}>
                                  <div className="executive-card h-100">
                                    <img
                                      src={resolvePhotoUrl(user.photo, API_BASE_URL)}
                                      alt={user.name || "Ward Executive"}
                                      className="executive-image"
                                      onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src =
                                          "/No Image Available.png";
                                      }}
                                    />
                                    <div className="executive-name">{user.name || "Unnamed"}</div>
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

                        {/* 🕰 Past Ward Executives */}
                        {past.length > 0 && (
                          <div className="mb-5">
                            <h4
                              className="fw-bold text-light p-2 rounded mb-4"
                              style={{ backgroundColor: "#3d6180ff" }}
                            >
                              🕰 Past Ward Executives ({past.length})
                            </h4>
                            <Row className="g-4 justify-content-center">
                              {past.map((user) => (
                                <Col xs={12} sm={6} md={4} key={user._id}>
                                  <div
                                    className="executive-card h-100"
                                    style={{ backgroundColor: "#f1f1f1" }}
                                  >
                                    <img
                                      src={resolvePhotoUrl(user.photo, API_BASE_URL)}
                                      alt={user.name || "Ward Executive"}
                                      className="executive-image"
                                      onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src =
                                          "/No Image Available.png";
                                      }}
                                    />
                                    <div className="executive-name">{user.name || "Unnamed"}</div>
                                    <div className="executive-position">
                                      {user.role?.position || "—"}
                                    </div>
                                    {(user.role?.termStart || user.role?.termEnd) && (
                                      <div className="executive-term">
                                        {user.role?.termStart || "?"} –{" "}
                                        {user.role?.termEnd || "?"}
                                      </div>
                                    )}
                                    <div className="executive-status text-muted fw-bold">Past</div>
                                  </div>
                                </Col>
                              ))}
                            </Row>
                          </div>
                        )}

                        {/* 🪶 Empty ward */}
                        {current.length === 0 && past.length === 0 && (
                          <p className="text-center text-light">
                            No ward executives found for this ward.
                          </p>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
          </Container>

          {/* ⬆ Back to Top Button */}
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
