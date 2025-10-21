// src/pages/Generic/RegionalExecutivesPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import PageWithFlagBackground from "@components/Layout/PageWithFlagBackground";
import RegionalNavbar from "@components/Navbars/RegionalNavbar";
import type { User, Role } from "@api/users"; // ✅ unified import
import "@pages/Presidents.css";
import { API_BASE_URL } from "@api/config";
import { resolvePhotoUrl } from "../../utils/photo";
import { getRegionalExecutives } from "@data/executives/executiveController";

// ✅ Local extension
interface LocalUser extends User {
  role: Role & {
    isActive?: boolean;
    termStart?: string;
    termEnd?: string;
  };
}

// ✅ Term periods
const TERM_PERIODS = [
  { label: "2024–2028", start: "2024-01-01", end: "2028-12-31" },
  { label: "2020–2024", start: "2020-01-01", end: "2023-12-31" },
  { label: "2016–2020", start: "2016-01-01", end: "2019-12-31" },
  { label: "2012–2016", start: "2012-01-01", end: "2015-12-31" },
  { label: "2008–2012", start: "2008-01-01", end: "2011-12-31" },
];

// ✅ Executive order
const EXECUTIVE_HIERARCHY = [
  "Regional Chairman",
  "1st Vice Chairman",
  "2nd Vice Chairman",
  "3rd Vice Chairman",
  "Regional Secretary",
  "Deputy Regional Secretary",
  "Regional Treasurer",
  "Deputy Regional Treasurer",
  "Regional Organizer",
  "Deputy Regional Organizer",
  "Regional Youth Organizer",
  "Deputy Regional Youth Organizer",
  "Regional Women's Organizer",
  "Deputy Regional Women's Organizer",
  "Regional Nasara Coordinator",
  "Deputy Regional Nasara Coordinator",
];

export default function RegionalExecutivesPage() {
  const { region } = useParams<{ region: string }>();
  const [groupedTerms, setGroupedTerms] = useState<Record<string, LocalUser[]>>({});
  const [openTerm, setOpenTerm] = useState<Record<string, boolean>>({});
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
  async function loadExecutives() {
    const CACHE_KEY = `regional-executives-${region}`;
    const cached = localStorage.getItem(CACHE_KEY);

    // 💾 Show cached executives instantly
    if (cached) {
      console.log(`💾 Showing cached executives for ${region}`);
      setGroupedTerms(JSON.parse(cached));
    }

    try {
      console.log(`🌐 Fetching fresh executives for ${region}...`);
      const executives = await getRegionalExecutives(region || "");
      if (!Array.isArray(executives)) return;

      const mapped = (executives as User[]).map((u) => {
        const role = u.role || {};
        const termStart = role.termStartDate || role.termStart || "";
        const termEnd = role.termEndDate || role.termEnd || "";
        const hasEnded = termEnd && new Date(termEnd).getTime() < Date.now();
        return {
          ...u,
          role: { ...role, termStart, termEnd, isActive: !hasEnded },
        } as LocalUser;
      });

      // ✅ Group by term
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

      Object.keys(grouped).forEach((key) => {
        if (grouped[key].length === 0) delete grouped[key];
      });

      // ✅ Update state and cache
      setGroupedTerms(grouped);
      localStorage.setItem(CACHE_KEY, JSON.stringify(grouped));
      console.log(`✅ Updated executives cache for ${region}`);
    } catch (err) {
      console.error("❌ Failed to fetch executives:", err);
    }
  }

  loadExecutives();
}, [region]);

  const currentYear = new Date().getFullYear();
  const latestTerm = TERM_PERIODS.find(
    (t) =>
      currentYear >= parseInt(t.start.split("-")[0]) &&
      currentYear <= parseInt(t.end.split("-")[0])
  );

  return (
    <>
      <RegionalNavbar region={region || ""} />
      <PageWithFlagBackground title={`👥 Regional Executives - ${region}`}>
        <Container className="py-4">
          {Object.entries(groupedTerms).length === 0 ? (
            <p className="text-light text-center">
              No regional executives found for this region.
            </p>
          ) : (
            Object.entries(groupedTerms).map(([term, execs]) => {
              if (execs.length === 0) return null;
              const isCurrent = term === latestTerm?.label;

              const sortedExecs = [...execs].sort(
                (a, b) =>
                  EXECUTIVE_HIERARCHY.indexOf(a.role?.position || "") -
                  EXECUTIVE_HIERARCHY.indexOf(b.role?.position || "")
              );

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
                        {sortedExecs.map((user) => (
                          <Col xs={6} md={3} key={user._id}>
                            <div
                              className="executive-card h-100"
                              style={{
                                backgroundColor: isCurrent ? "#ffffff" : "#f1f1f1",
                              }}
                            >
                              <img
                                src={resolvePhotoUrl(user.photo, API_BASE_URL)}
                                alt={user.name || "Executive"}
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
