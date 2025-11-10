import { useEffect, useState } from "react";
import { Container, Form, Row, Col } from "react-bootstrap";
import PageWithFlagBackground from "@components/Layout/PageWithFlagBackground";
import { API_BASE_URL } from "@api/config";
import type { User, Role } from "@api/users";
import "@pages/Presidents.css";
import { resolvePhotoUrl } from "../../utils/photo";
import { getNationalExecutives } from "@data/executives/executiveController";

// ✅ Local interface
interface LocalUser extends User {
  role: Role & {
    termStart?: string;
    termEnd?: string;
    isActive?: boolean;
  };
}

// ✅ National Executive Hierarchy (Fixed Order)
const EXECUTIVE_HIERARCHY = [
  "National Chairman",
  "1st Vice Chairman",
  "2nd Vice Chairman",
  "3rd Vice Chairman",
  "General Secretary",
  "1st Deputy General Secretary",
  "2nd Deputy General Secretary",
  "National Communication Officer",
  "1st Deputy Communication Officer",
  "2nd Deputy Communication Officer",
  "National Organizer",
  "1st Deputy National Organizer",
  "2nd Deputy National Organizer",
  "National Youth Organizer",
  "1st Deputy National Youth Organizer",
  "2nd Deputy National Youth Organizer",
  "National Women's Organizer",
  "1st Deputy Women's Organizer",
  "2nd Deputy Women's Organizer",
  "Zongo Caucus Coordinator",
  "NEC Member (1)",
  "NEC Member (2)",
  "NEC Member (3)",
  "NEC Member (4)",
  "NEC Member (5)",
];

export default function NationalExecutives() {
  const [executives, setExecutives] = useState<LocalUser[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string>("");

  // ✅ Fetch national executives with cache
  useEffect(() => {
    async function loadExecutives() {
      const CACHE_KEY = "national-executives";
      const cached = localStorage.getItem(CACHE_KEY);

      // 💾 Show cached instantly
      if (cached) {
        console.log("💾 Showing cached national executives");
        setExecutives(JSON.parse(cached));
      }

      try {
        console.log("🌐 Fetching fresh national executives...");
        const fetched = await getNationalExecutives();
        if (!Array.isArray(fetched)) return;

        const mapped = fetched.map((u) => {
          const role = u.role || {};
          const termStart = role.termStartDate || role.termStart || "";
          const termEnd = role.termEndDate || role.termEnd || "";
          const hasEnded = termEnd && new Date(termEnd).getTime() < Date.now();
          return {
            ...u,
            role: { ...role, termStart, termEnd, isActive: !hasEnded },
          } as LocalUser;
        });

        setExecutives(mapped);
        localStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
        console.log("✅ Updated national executives cache");
      } catch (err) {
        console.error("❌ Failed to fetch national executives:", err);
      }
    }

    loadExecutives();
  }, []);

  // ✅ Group executives by term
  const groupedTerms: Record<string, LocalUser[]> = {};
  executives.forEach((exec) => {
    const start = exec.role?.termStart?.slice(0, 4) || "?";
    const end = exec.role?.termEnd?.slice(0, 4) || "Present";
    const label = `${start}-${end}`;
    if (!groupedTerms[label]) groupedTerms[label] = [];
    groupedTerms[label].push(exec);
  });

  const termKeys = Object.keys(groupedTerms).sort((a, b) => b.localeCompare(a));

  // ✅ Default to latest term
  useEffect(() => {
    if (termKeys.length > 0 && !selectedTerm) {
      setSelectedTerm(termKeys[0]);
    }
  }, [termKeys, selectedTerm]);

  return (
    <div style={{ backgroundColor: "#042155ee", minHeight: "100vh" }}>
      <PageWithFlagBackground title="🗳️ National Executives by Term">
        <Container className="py-4">
          {/* 🔽 Dropdown selector */}
          {termKeys.length > 1 && (
            <Form.Select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="mb-4"
            >
              {termKeys.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </Form.Select>
          )}

          {/* 🧩 Render selected term */}
          {termKeys
            .filter((t) => t === selectedTerm)
            .map((term) => {
              const list = groupedTerms[term] || [];
              const total = list.length;
              const current = list.filter((u) => u.role?.isActive).length;
              const past = total - current;

              return (
                <div key={term} className="mb-5">
                  <h2
                    className="fw-bold text-light p-2 rounded mb-4"
                    style={{ backgroundColor: "#198754" }}
                  >
                    🌟 {term} National Executives
                  </h2>

                  {/* ✅ Counter Bar */}
                  <div
                    className="mb-4 py-2 text-center fw-bold rounded"
                    style={{
                      background: "linear-gradient(90deg, #006b3f, #d71a28)",
                      color: "white",
                    }}
                  >
                    🌍 Total: {total} | ✅ Current: {current} | 🕰 Past: {past}
                  </div>

                  <Row className="g-4 justify-content-center">
                    {[...list]
                      .sort((a, b) => {
                        const posA = EXECUTIVE_HIERARCHY.indexOf(a.role?.position || "");
                        const posB = EXECUTIVE_HIERARCHY.indexOf(b.role?.position || "");
                        if (posA === -1 && posB === -1)
                          return (a.name || "").localeCompare(b.name || "");
                        if (posA === -1) return 1;
                        if (posB === -1) return -1;
                        return posA - posB;
                      })
                      .map((exec) => (
                        <Col xs={6} sm={4} md={3} lg={2} key={exec._id}>
                          <div
                            className="executive-card"
                            style={{
                              backgroundColor: exec.role?.isActive
                                ? "#ffffff"
                                : "#f1f1f1",
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
                                {exec.role?.termEnd || "Present"}
                              </div>
                            )}
                            <div
                              className={`executive-status ${
                                exec.role?.isActive
                                  ? "text-success fw-bold"
                                  : "text-secondary fw-bold"
                              }`}
                            >
                              {exec.role?.isActive ? "Current" : "Past"}
                            </div>
                          </div>
                        </Col>
                      ))}
                  </Row>
                </div>
              );
            })}

          {/* 🪶 Empty state */}
          {executives.length === 0 && (
            <p className="text-center text-light mt-4">
              No national executives found.
            </p>
          )}
        </Container>
      </PageWithFlagBackground>
    </div>
  );
}
