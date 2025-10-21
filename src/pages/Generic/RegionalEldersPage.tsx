// src/pages/Generic/RegionalEldersPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import PageWithFlagBackground from "@components/Layout/PageWithFlagBackground";
import RegionalNavbar from "@components/Navbars/RegionalNavbar";
import type { User, Role } from "@api/users"; // ✅ unified import
import "@pages/Presidents.css";
import { API_BASE_URL } from "@api/config";
import { resolvePhotoUrl } from "../../utils/photo";
import { getRegionalElders } from "@data/executives/executiveController"; // ✅ centralized fetch

// ✅ Local extended user type
interface LocalUser extends User {
  role: Role & {
    isActive?: boolean;
    termStart?: string;
    termEnd?: string;
  };
}

// ✅ Fixed hierarchy for Regional Council of Elders
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


// ✅ Official NPP term ranges
const TERM_PERIODS = [
  { label: "2024–2028", start: "2024-01-01", end: "2028-12-31" },
  { label: "2020–2024", start: "2020-01-01", end: "2023-12-31" },
  { label: "2016–2020", start: "2016-01-01", end: "2019-12-31" },
  { label: "2012–2016", start: "2012-01-01", end: "2015-12-31" },
  { label: "2008–2012", start: "2008-01-01", end: "2011-12-31" },
];

export default function RegionalEldersPage() {
  const { region } = useParams<{ region: string }>();
  const [groupedTerms, setGroupedTerms] = useState<Record<string, LocalUser[]>>({});
  const [openTerm, setOpenTerm] = useState<Record<string, boolean>>({});
  const [showTop, setShowTop] = useState(false);

  // ✅ Fetch elders via centralized controller (with cache)
useEffect(() => {
  async function loadElders() {
    const CACHE_KEY = `regional-elders-${region}`;
    const cached = localStorage.getItem(CACHE_KEY);

    // 💾 Show cached elders instantly
    if (cached) {
      console.log(`💾 Showing cached elders for ${region}`);
      setGroupedTerms(JSON.parse(cached));
    }

    try {
      console.log(`🌐 Fetching fresh elders for ${region}...`);
      const elders = await getRegionalElders(region || "");
      if (!Array.isArray(elders)) return;

      const mapped = (elders as User[]).map((u) => {
        const role = u.role || {};
        const termStart = role.termStartDate || role.termStart || "";
        const termEnd = role.termEndDate || role.termEnd || "";
        const hasEnded = termEnd && new Date(termEnd).getTime() < Date.now();
        return {
          ...u,
          role: { ...role, termStart, termEnd, isActive: !hasEnded },
        } as LocalUser;
      });

      // ✅ Group by term period
      const grouped: Record<string, LocalUser[]> = {};
      TERM_PERIODS.forEach((term) => {
        grouped[term.label] = mapped.filter((u) => {
          const start = u.role?.termStart;
          if (!start) return false;
          const userStart = new Date(start).getTime();
          const termStart = new Date(term.start).getTime();
          const termEnd = new Date(term.end).getTime();
          return userStart >= termStart && userStart <= termEnd;
        });
      });

      // ✅ Remove empty groups
      Object.keys(grouped).forEach((key) => {
        if (grouped[key].length === 0) delete grouped[key];
      });

      // ✅ Update state + cache
      setGroupedTerms(grouped);
      localStorage.setItem(CACHE_KEY, JSON.stringify(grouped));
      console.log(`✅ Updated elders cache for ${region}`);
    } catch (err) {
      console.error("❌ Failed to fetch regional elders:", err);
    }
  }

  loadElders();
}, [region]);


  // ✅ Identify current term dynamically
  const currentYear = new Date().getFullYear();
  const latestTerm = TERM_PERIODS.find(
    (t) =>
      currentYear >= parseInt(t.start.split("-")[0]) &&
      currentYear <= parseInt(t.end.split("-")[0])
  );

  return (
    <>
      <RegionalNavbar region={region || ""} />
      <PageWithFlagBackground title={`👴 Regional Council of Elders - ${region}`}>
        <Container className="py-4">
          {Object.entries(groupedTerms).length === 0 ? (
            <p className="text-light text-center">
              No regional elders found for this region.
            </p>
          ) : (
            Object.entries(groupedTerms).map(([term, elders]) => {
              if (elders.length === 0) return null;
              const isCurrent = term === latestTerm?.label;

              // ✅ Sort elders by defined hierarchy instead of alphabetical order
              const sortedElders = [...elders].sort((a, b) => {
                const posA = ELDERS_HIERARCHY.indexOf(a.role?.position || "");
                const posB = ELDERS_HIERARCHY.indexOf(b.role?.position || "");
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
                        {sortedElders.map((user) => (
                          <Col xs={12} sm={6} md={4} key={user._id}>
                            <div
                              className="executive-card h-100"
                              style={{
                                backgroundColor: isCurrent ? "#ffffff" : "#f1f1f1",
                              }}
                            >
                              <img
                                src={resolvePhotoUrl(user.photo, API_BASE_URL)} // ✅ unified resolver
                                alt={user.name || "Elder"}
                                className="executive-image"
                                style={!isCurrent ? { filter: "grayscale(100%)" } : {}}
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
                              <div
                                className={`executive-status ${
                                  isCurrent
                                    ? "text-success fw-bold"
                                    : "text-secondary fw-bold"
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
      </PageWithFlagBackground>
    </>
  );
}
