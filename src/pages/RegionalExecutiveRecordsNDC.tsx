import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import PageWithFlagBackground from "@components/Layout/PageWithFlagBackground";
import { API_BASE_URL } from "@api/config";
import type { User } from "@api/users";
import ExecutiveSummary from "@components/ExecutiveSummary";

interface LocalUser extends User {
  _computedActive?: boolean;
}

const norm = (s?: string) => (s || "").toLowerCase().replace(/-/g, " ").trim();

export default function RegionalExecutiveRecordsNDC() {
  const { region } = useParams<{ region: string }>();
  const [users, setUsers] = useState<LocalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRegional() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/users?region=${region}`);
        const json = await res.json();
        const data: LocalUser[] = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : [];
        setUsers(data);
      } catch (err) {
        console.error("❌ Failed to fetch regional executives:", err);
        setError("Failed to load regional executive records.");
      } finally {
        setLoading(false);
      }
    }
    fetchRegional();
  }, [region]);

  // ✅ Mark active vs past
  const processed = useMemo(() => {
    const now = new Date();
    return users.map((u) => {
      const end = u.role?.termEndDate || u.role?.termEnd;
      const isActive = !end || new Date(end).getTime() >= now.getTime();
      return { ...u, _computedActive: isActive };
    });
  }, [users]);

  // ✅ Group by unit
  const grouped = useMemo(() => {
    const map: Record<string, LocalUser[]> = {};
    processed.forEach((u) => {
      const unit = norm(u.role?.unit);
      if (!map[unit]) map[unit] = [];
      map[unit].push(u);
    });
    return map;
  }, [processed]);

  const totalAll = processed.length;
  const totalCurrent = processed.filter((u) => u._computedActive).length;
  const totalPast = totalAll - totalCurrent;

  if (loading)
    return (
      <PageWithFlagBackground title={`${region} Executive Records`}>
        <p className="text-light text-center my-5">⏳ Loading...</p>
      </PageWithFlagBackground>
    );

  if (error)
    return (
      <PageWithFlagBackground title={`${region} Executive Records`}>
        <p className="text-danger text-center mt-5">{error}</p>
      </PageWithFlagBackground>
    );

  return (
    <div style={{ backgroundColor: "#004d26", minHeight: "100vh" }}>
      {/* ✅ Region-level counter banner */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1050,
          background: "linear-gradient(90deg, #e61a23, #006b3f)",
          color: "white",
          padding: "8px 0",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
      >
        <Container className="d-flex justify-content-between align-items-center fw-bold">
          <span>🌍 Total: {totalAll}</span>
          <span style={{ color: "#00ff66" }}>✅ Current: {totalCurrent}</span>
          <span className="text-warning">🕰 Past: {totalPast}</span>
        </Container>
      </div>

      <PageWithFlagBackground title={`📊 ${region} Executive Records`}>
        <Container className="pt-5 mt-5">
          <Card className="mb-4 shadow-sm bg-dark text-light">
            <Card.Header className="fw-bold fs-5 text-warning">
              {region} Regional Executive Data Summary
            </Card.Header>
            <Card.Body>
              <p className="text-info mb-0">
                Displays all executives within {region}, including regional,
                constituency, and branch levels where applicable.
              </p>
            </Card.Body>
          </Card>

          {/* ✅ Section summaries */}
          <Row xs={1} md={2} className="g-3">
            {Object.entries(grouped).map(([unit, arr]) => {
              const current = arr.filter((u) => u._computedActive).length;
              const past = arr.length - current;
              return (
                <Col key={unit}>
                  <ExecutiveSummary
                    data={arr}
                    title={`${unit
                      .split(" ")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ")} Summary`}
                  />
                  <div className="text-center fw-bold text-light mb-3">
                    🌍 Total: {arr.length} | ✅ Current: {current} | 🕰 Past: {past}
                  </div>
                </Col>
              );
            })}
          </Row>

          <div className="text-center mt-4">
            <Button
              variant="light"
              className="fw-bold"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              ⬆ Back to Top
            </Button>
          </div>
        </Container>
      </PageWithFlagBackground>
    </div>
  );
}
