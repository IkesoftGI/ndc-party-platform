// src/pages/Shared/ConstituencyEldersPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import PageWithFlagBackground from "@components/Layout/PageWithFlagBackground";
import ConstituencyNavbar from "@components/Navbars/ConstituencyNavbar";
import type { User, Role } from "@api/users"; // ✅ unified type source
import "@pages/Presidents.css";
import { API_BASE_URL } from "@api/config";
import { resolvePhotoUrl } from "../../utils/photo";

// ✅ Local extended type
interface LocalUser extends User {
  role: Role & {
    isActive?: boolean;
    termStart?: string;
    termEnd?: string;
  };
}

// ✅ Official NPP term periods
const TERM_PERIODS = [
  { label: "2024–2028", start: "2024-01-01", end: "2028-12-31" },
  { label: "2020–2024", start: "2020-01-01", end: "2023-12-31" },
  { label: "2016–2020", start: "2016-01-01", end: "2019-12-31" },
  { label: "2012–2016", start: "2012-01-01", end: "2015-12-31" },
  { label: "2008–2012", start: "2008-01-01", end: "2011-12-31" },
];

// ✅ Fixed hierarchy for Constituency Council of Elders
const ELDERS_HIERARCHY = [
  "Council Chairman",
  "Council Vice Chairman",
  "Council Secretary",
  "Council Deputy Secretary",
  "Council Member 1",
  "Council Member 2",
  "Council Member 3",
  "Council Member 4",
  "Council Member 5",
  "Council Member 6",
];

// ✅ Normalizer
const norm = (s?: string) => (s || "").toLowerCase().replace(/-/g, " ").trim();

export default function ConstituencyEldersPage() {
  const { region, constituency } = useParams<{ region: string; constituency: string }>();
  const [groupedTerms, setGroupedTerms] = useState<Record<string, LocalUser[]>>({});
  const [openTerm, setOpenTerm] = useState<Record<string, boolean>>({});
  const [showTop, setShowTop] = useState(false);

  // ✅ Fetch elders with cache-first optimization
useEffect(() => {
  async function fetchElders() {
    const CACHE_KEY = `constituency-elders-${region}-${constituency}`;
    const cached = localStorage.getItem(CACHE_KEY);

    // 💾 Instantly show cached data if available
    if (cached) {
      console.log(`💾 Showing cached constituency elders for ${constituency}`);
      const parsed = JSON.parse(cached);
      setGroupedTerms(parsed.grouped || {});
    }

    try {
      console.log(`🌐 Fetching fresh constituency elders for ${constituency}...`);
      const res = await fetch(`${API_BASE_URL}/api/users`);
      const json = await res.json();
      const data: User[] = Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json)
        ? json
        : [];

      const r = norm(region);
      const c = norm(constituency);

      const filtered = data
        .filter(
          (u) =>
            norm(u.role?.unit) === "constituency council of elders" &&
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
      console.log(`✅ Updated constituency elders cache for ${constituency}`);
    } catch (err) {
      console.error("❌ Failed to fetch elders:", err);
    }
  }

  fetchElders();
}, [region, constituency]);

// ✅ Back-to-top button visibility
useEffect(() => {
  const onScroll = () => setShowTop(window.scrollY > 300);
  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, []);


  // ✅ Determine current term dynamically
  const currentYear = new Date().getFullYear();
  const latestTerm = TERM_PERIODS.find(
    (t) =>
      currentYear >= parseInt(t.start.split("-")[0]) &&
      currentYear <= parseInt(t.end.split("-")[0])
  );

  return (
    <>
      <ConstituencyNavbar region={region || ""} constituency={constituency || ""} />
      <PageWithFlagBackground title={`👴 Constituency Council of Elders - ${constituency}`}>
        <Container className="py-4">
          {Object.entries(groupedTerms).length === 0 ? (
            <p className="text-light text-center">No elders found for this constituency.</p>
          ) : (
            Object.entries(groupedTerms).map(([term, elders]) => {
              if (elders.length === 0) return null;
              const isCurrent = term === latestTerm?.label;
              // ✅ Sort elders by official hierarchy
              const sortedElders = [...elders].sort((a, b) => {
                const posA = ELDERS_HIERARCHY.indexOf(a.role?.position || "");
                const posB = ELDERS_HIERARCHY.indexOf(b.role?.position || "");
                // Unknown positions go to the bottom
                return (posA === -1 ? 999 : posA) - (posB === -1 ? 999 : posB);
              });

              return (
                <Card key={term} className="mb-4 shadow-sm">
                  <Card.Header
                    className={`fw-bold text-white ${
                      isCurrent ? "bg-success" : "bg-primary"
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      setOpenTerm((prev) => ({
                        ...prev,
                        [term]: !prev[term],
                      }))
                    }
                  >
                    {isCurrent ? "🌟 Current Term" : "🕰"} {term}
                  </Card.Header>

                  {openTerm[term] && (
                    <Card.Body>
                      <Row className="g-4 justify-content-center">
                        {sortedElders.map((elder) => (
                          <Col xs={12} sm={6} md={4} key={elder._id}>
                            <div
                              className="executive-card h-100"
                              style={{
                                backgroundColor: isCurrent ? "#ffffff" : "#f1f1f1",
                              }}
                            >
                              <img
                                src={resolvePhotoUrl(elder.photo, API_BASE_URL)}
                                alt={elder.name || "Elder"}
                                className="executive-image"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src =
                                    "/No Image Available.png";
                                }}
                                style={!isCurrent ? { filter: "grayscale(100%)" } : {}}
                              />
                              <div className="executive-name">
                                {elder.name || "Unnamed"}
                              </div>
                              <div className="executive-position">
                                {elder.role?.position || "—"}
                              </div>
                              {(elder.role?.termStart || elder.role?.termEnd) && (
                                <div className="executive-term">
                                  {elder.role?.termStart || "?"} –{" "}
                                  {elder.role?.termEnd || "?"}
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
      </PageWithFlagBackground>
    </>
  );
}
