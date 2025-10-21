// src/pages/Generic/ConstituencyExecutivesPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import PageWithFlagBackground from "@components/Layout/PageWithFlagBackground";
import type { User, Role } from "@api/users"; // ✅ unified import
import { API_BASE_URL } from "@api/config";
import { resolvePhotoUrl } from "../../utils/photo";
import "@pages/Presidents.css";

// ✅ Normalize helper
const norm = (s?: string) => (s || "").toLowerCase().replace(/-/g, " ").trim();

// ✅ Extended local type
interface LocalUser extends User {
  role: Role & {
    isActive?: boolean;
    termStart?: string;
    termEnd?: string;
  };
}

// ✅ Define official NPP term periods
const TERM_PERIODS = [
  { label: "2024–2028", start: "2024-01-01", end: "2028-12-31" },
  { label: "2020–2024", start: "2020-01-01", end: "2023-12-31" },
  { label: "2016–2020", start: "2016-01-01", end: "2019-12-31" },
  { label: "2012–2016", start: "2012-01-01", end: "2015-12-31" },
  { label: "2008–2012", start: "2008-01-01", end: "2011-12-31" },
];

// ✅ Local hierarchy order
const EXECUTIVE_HIERARCHY = [
  "Chairman", "1st Vice Chairman", "2nd Vice Chairman", "3rd Vice Chairman",
  "Constituency Secretary", "Deputy Constituency Secretary",
  "Constituency Treasurer", "Deputy Constituency Treasurer",
  "Constituency Organizer", "Deputy Constituency Organizer",
  "Constituency Youth Organizer", "Deputy Constituency Youth Organizer",
  "Constituency Women's Organizer", "Deputy Constituency Women's Organizer",
  "Constituency Nasara Coordinator", "Deputy Constituency Nasara Coordinator",
];

export default function ConstituencyExecutivesPage() {
  const { region, constituency } = useParams<{ region?: string; constituency?: string }>();
  const [groupedTerms, setGroupedTerms] = useState<Record<string, LocalUser[]>>({});
  const [openTerm, setOpenTerm] = useState<Record<string, boolean>>({});
  const [showTop, setShowTop] = useState(false);

  // ✅ Fetch executives with cache-first optimization
useEffect(() => {
  async function fetchExecutives() {
    const CACHE_KEY = `constituency-executives-${region}-${constituency}`;
    const cached = localStorage.getItem(CACHE_KEY);

    // 💾 Instantly show cached data if available
    if (cached) {
      console.log(`💾 Showing cached constituency executives for ${constituency}`);
      const parsed = JSON.parse(cached);
      setGroupedTerms(parsed.grouped || {});
    }

    try {
      console.log(`🌐 Fetching fresh constituency executives for ${constituency}...`);
      const res = await fetch(`${API_BASE_URL}/api/users`);
      const json = await res.json();
      const users: User[] = Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json)
        ? json
        : [];

      const r = norm(region);
      const c = norm(constituency);

      const filtered = users
        .filter(
          (u) =>
            norm(u.role?.unit) === "constituency executives" &&
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

      // ✅ Group by term range
      const grouped: Record<string, LocalUser[]> = {};
      TERM_PERIODS.forEach((term) => {
        grouped[term.label] = filtered.filter((u) => {
          const start = u.role?.termStart;
          if (!start) return false;
          const userStart = new Date(start).getTime();
          const termStart = new Date(term.start).getTime();
          const termEnd = new Date(term.end).getTime();
          return userStart >= termStart && userStart <= termEnd;
        });
      });

      // ✅ Remove empty term groups
      Object.keys(grouped).forEach((k) => {
        if (grouped[k].length === 0) delete grouped[k];
      });

      setGroupedTerms(grouped);

      // ✅ Cache results for faster reloads
      localStorage.setItem(CACHE_KEY, JSON.stringify({ grouped }));
      console.log(`✅ Updated constituency executive cache for ${constituency}`);
    } catch (err) {
      console.error("❌ Failed to fetch constituency executives:", err);
    }
  }

  fetchExecutives();
}, [region, constituency]);

// ✅ Scroll tracking for back-to-top button
useEffect(() => {
  const onScroll = () => setShowTop(window.scrollY > 300);
  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, []);


  const currentYear = new Date().getFullYear();
  const latestTerm = TERM_PERIODS.find(
    (t) =>
      currentYear >= parseInt(t.start.split("-")[0]) &&
      currentYear <= parseInt(t.end.split("-")[0])
  );

  return (
    <>
      <PageWithFlagBackground
        title={`👔 ${constituency?.replace(/-/g, " ")} Constituency Executives`}
      >
        <Container className="py-4">
          {Object.entries(groupedTerms).length === 0 ? (
            <p className="text-light text-center">
              No constituency executives found for this area.
            </p>
          ) : (
            Object.entries(groupedTerms).map(([term, users]) => {
              const sortedUsers = [...users].sort(
                (a, b) =>
                  EXECUTIVE_HIERARCHY.indexOf(a.role?.position || "") -
                  EXECUTIVE_HIERARCHY.indexOf(b.role?.position || "")
              );

              const isCurrent = term === latestTerm?.label;

              return (
                <Card key={term} className="mb-4 shadow-sm">
                  <Card.Header
                    className={`fw-bold text-white ${
                      isCurrent ? "bg-success" : "bg-primary"
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      setOpenTerm((prev) => ({ ...prev, [term]: !prev[term] }))
                    }
                  >
                    {isCurrent ? "🌟 Current Term" : "🕰"} {term}
                  </Card.Header>

                  {openTerm[term] && (
                    <Card.Body>
                      <Row className="g-4 justify-content-center">
                        {sortedUsers.map((exec) => (
                          <Col xs={6} md={3} key={exec._id}>
                            <div
                              className="executive-card h-100"
                              style={{
                                backgroundColor: isCurrent ? "#fff" : "#f1f1f1",
                              }}
                            >
                              <img
                                src={resolvePhotoUrl(exec.photo, API_BASE_URL)}
                                alt={exec.name || "Executive"}
                                className="executive-image"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src =
                                    "/No Image Available.png";
                                }}
                              />
                              <div className="executive-name">
                                {exec.name || "Unnamed"}
                              </div>
                              <div className="executive-position">
                                {exec.role?.position || "—"}
                              </div>
                              {(exec.role?.termStart || exec.role?.termEnd) && (
                                <div className="executive-term">
                                  {exec.role?.termStart || "?"} –{" "}
                                  {exec.role?.termEnd || "?"}
                                </div>
                              )}
                              <div
                                className={`executive-status ${
                                  isCurrent
                                    ? "text-success fw-bold"
                                    : "text-muted fw-bold"
                                }`}
                              >
                                {isCurrent ? "Current" : "Past"}
                              </div>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </Card.Body>
                  )}
                </Card>
              );
            })
          )}
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
