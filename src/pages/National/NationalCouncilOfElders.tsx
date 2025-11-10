// src/pages/National/NationalCouncilOfElders.tsx
import { useEffect, useState } from "react";
import { Container, Form, Row, Col } from "react-bootstrap";
import PageWithFlagBackground from "@components/Layout/PageWithFlagBackground";
import type { User, Role } from "@api/users";
import "@pages/Presidents.css";
import { API_BASE_URL } from "@api/config";
import { resolvePhotoUrl } from "../../utils/photo";
import { getNationalElders } from "@data/executives/executiveController";

interface LocalUser extends User {
  role: Role & {
    termStart?: string;
    termEnd?: string;
    isActive?: boolean;
  };
}

// ✅ NDC National Council of Elders Hierarchy
const ELDERS_HIERARCHY = [
  "Chairman",
  "Vice Chairman",
  "Secretary",
  "Deputy Secretary",
  "Treasurer",
  "Deputy Treasurer",
  "Organizer",
  "Deputy Organizer",
  "Member",
];

export default function NationalCouncilOfElders() {
  const [elders, setElders] = useState<LocalUser[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string>("");

  // ✅ Fetch elders (with cache)
  useEffect(() => {
    async function loadElders() {
      const CACHE_KEY = "national-elders";
      const cached = localStorage.getItem(CACHE_KEY);

      if (cached) {
        console.log("💾 Showing cached national elders");
        setElders(JSON.parse(cached));
      }

      try {
        console.log("🌐 Fetching fresh national elders...");
        const fetched = await getNationalElders();
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

        setElders(mapped);
        localStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
        console.log("✅ Updated national elders cache");
      } catch (err) {
        console.error("❌ Failed to fetch national council of elders:", err);
      }
    }

    loadElders();
  }, []);

  // ✅ Group by term
  const groupedTerms: Record<string, LocalUser[]> = {};
  elders.forEach((elder) => {
    const start = elder.role?.termStart?.slice(0, 4) || "?";
    const end = elder.role?.termEnd?.slice(0, 4) || "Present";
    const label = `${start}-${end}`;
    if (!groupedTerms[label]) groupedTerms[label] = [];
    groupedTerms[label].push(elder);
  });

  const termKeys = Object.keys(groupedTerms).sort((a, b) => b.localeCompare(a));

  // ✅ Default to latest term
  useEffect(() => {
    if (termKeys.length > 0 && !selectedTerm) {
      setSelectedTerm(termKeys[0]);
    }
  }, [termKeys, selectedTerm]);

  return (
    <div style={{ backgroundColor: "#031772ff", minHeight: "100vh" }}>
      <PageWithFlagBackground title="👴 National Council of Elders by Term">
        <Container className="py-4">
          {/* 🔽 Term selector */}
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

          {/* 🧩 Selected term display */}
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
                    style={{ backgroundColor: "#8a8653ff" }}
                  >
                    🏛️ {term} National Council of Elders
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

                  {/* 👥 Members Grid */}
                  <Row className="g-4 justify-content-center">
                    {[...list]
                      .sort((a, b) => {
                        const posA = ELDERS_HIERARCHY.indexOf(a.role?.position || "");
                        const posB = ELDERS_HIERARCHY.indexOf(b.role?.position || "");
                        if (posA === -1 && posB === -1)
                          return (a.name || "").localeCompare(b.name || "");
                        if (posA === -1) return 1;
                        if (posB === -1) return -1;
                        return posA - posB;
                      })
                      .map((elder) => (
                        <Col xs={6} sm={4} md={3} lg={2} key={elder._id}>
                          <div
                            className="executive-card"
                            style={{
                              backgroundColor: elder.role?.isActive
                                ? "#ffffff"
                                : "#f1f1f1",
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
                                {elder.role?.termEnd || "Present"}
                              </div>
                            )}
                            <div
                              className={`executive-status ${
                                elder.role?.isActive
                                  ? "text-success fw-bold"
                                  : "text-secondary fw-bold"
                              }`}
                            >
                              {elder.role?.isActive ? "Current" : "Past"}
                            </div>
                          </div>
                        </Col>
                      ))}
                  </Row>
                </div>
              );
            })}

          {/* 🪶 Empty state */}
          {elders.length === 0 && (
            <p className="text-center text-light mt-4">
              No National Council of Elders found.
            </p>
          )}
        </Container>
      </PageWithFlagBackground>
    </div>
  );
}
