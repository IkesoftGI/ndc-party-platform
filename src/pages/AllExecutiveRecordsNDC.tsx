// src/pages/AllExecutiveRecordsNDC.tsx
import { useEffect, useState, useMemo } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import PageWithFlagBackground from "@components/Layout/PageWithFlagBackground";
import { API_BASE_URL } from "@api/config";
import type { User } from "@api/users";
import ExecutiveSummary from "@components/ExecutiveSummary";
import { CSVLink } from "react-csv";

interface CombinedSummary {
  unit: string;
  count: number;
  current: number;
  past: number;
}

// ✅ Extend User for computed field
interface LocalUser extends User {
  _computedActive?: boolean;
}

// ✅ Normalize helper
const norm = (s?: string) => (s || "").toLowerCase().replace(/-/g, " ").trim();

export default function AllExecutiveRecordsNDC() {
  const [users, setUsers] = useState<LocalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch all executives
  useEffect(() => {
    async function fetchAll() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/users`);
        const json = await res.json();
        const data: LocalUser[] = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : [];
        setUsers(data);
      } catch (err) {
        console.error("❌ Failed to fetch NDC executives:", err);
        setError("Failed to load executive records.");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // ✅ Determine which executives are active
  const processed = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();

    return users.map((u) => {
      const endDate = u.role?.termEndDate || u.role?.termEnd;
      if (!endDate) return { ...u, _computedActive: true };
      const endYear = new Date(endDate).getFullYear();
      const isActive = endYear >= currentYear;
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

  // ✅ Build combined summary for totals
  const combined = useMemo(() => {
    const list: CombinedSummary[] = [];
    Object.entries(grouped).forEach(([unit, arr]) => {
      const current = arr.filter((u) => u._computedActive).length;
      const past = arr.length - current;
      list.push({ unit, count: arr.length, current, past });
    });
    return list;
  }, [grouped]);

  const totalAll = combined.reduce((acc, s) => acc + s.count, 0);
  const totalCurrent = combined.reduce((acc, s) => acc + s.current, 0);
  const totalPast = combined.reduce((acc, s) => acc + s.past, 0);

  // ✅ CSV export data
  const csvData = combined.map((s) => ({
    Unit: s.unit,
    Current: s.current,
    Past: s.past,
    Total: s.count,
  }));

  // ✅ Hierarchy order for display
  const HIERARCHY_ORDER = [
    "national executives",
    "national council of elders",
    "member of parliament",
    "metropolitan chief executive",
    "municipal chief executive",
    "district chief executive",
    "regional executives",
    "regional council of elders",
    "constituency executives",
    "constituency council of elders",
    "branch executives",
  ];

  if (loading)
    return (
      <PageWithFlagBackground title="All Executive Records">
        <p className="text-light text-center my-5">⏳ Loading data...</p>
      </PageWithFlagBackground>
    );

  if (error)
    return (
      <PageWithFlagBackground title="All Executive Records">
        <p className="text-danger text-center mt-5">{error}</p>
      </PageWithFlagBackground>
    );

  return (
    <div style={{ backgroundColor: "#004d26", minHeight: "100vh" }}>
      {/* ✅ Fixed Summary Banner */}
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
          <span>
            🌍 <strong>Total:</strong> {totalAll.toLocaleString()}
          </span>
          <span style={{ color: "#00ff66" }}>
            ✅ <strong>Current:</strong> {totalCurrent.toLocaleString()}
          </span>
          <span className="text-warning">
            🕰 <strong>Past:</strong> {totalPast.toLocaleString()}
          </span>
          <CSVLink
            data={csvData}
            filename="All_NDC_Executive_Records_Summary.csv"
            className="btn btn-light btn-sm fw-bold"
            style={{ color: "#006b3f" }}
          >
            ⬇️ Download CSV
          </CSVLink>
        </Container>
      </div>

      <PageWithFlagBackground title="📊 All Executive Records Summary">
        <Container className="pt-5 mt-5">
          {/* ✅ Intro Card */}
          <Card className="mb-4 shadow-sm bg-dark text-light">
            <Card.Header className="fw-bold fs-5 text-warning">
              NDC Executive Data Platform – Internal Use Only
            </Card.Header>
            <Card.Body>
              <p className="text-info">
                This page displays the full summary of executives across all units:
                National, Regional, Constituency, Branch Executives, and Council of Elders.
              </p>
            </Card.Body>
          </Card>

          {/* ✅ Hierarchical Summary Display */}
          <Row xs={1} md={2} className="g-3">
            {Object.entries(grouped)
              .sort(([a], [b]) => {
                const ia = HIERARCHY_ORDER.indexOf(a);
                const ib = HIERARCHY_ORDER.indexOf(b);
                if (ia === -1 && ib === -1) return a.localeCompare(b);
                if (ia === -1) return 1;
                if (ib === -1) return -1;
                return ia - ib;
              })
              .map(([unit, arr]) => (
                <Col key={unit}>
                  <ExecutiveSummary
                    data={arr}
                    title={`${unit
                      .split(" ")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ")} Summary`}
                  />
                </Col>
              ))}
          </Row>

          {/* 🌍 Regional Executive Summary */}
          <Card className="mt-4 shadow-sm bg-dark text-light">
            <Card.Header className="fw-bold fs-5 text-info">
              🌍 Executive Summary by Region
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                {Object.entries(
                  users.reduce((acc, user) => {
                    const region = (user.region || "Unknown Region").trim();
                    if (!acc[region]) acc[region] = { total: 0, current: 0, past: 0 };
                    acc[region].total += 1;
                    const end = user.role?.termEndDate || user.role?.termEnd;
                    const isActive = !end || new Date(end).getTime() >= Date.now();
                    if (isActive) acc[region].current += 1;
                    else acc[region].past += 1;
                    return acc;
                  }, {} as Record<string, { total: number; current: number; past: number }>)
                ).map(([region, stats]) => (
                  <Col md={4} key={region}>
                    <Card className="bg-success text-white h-100 shadow-sm">
                      <Card.Body>
                        <h5 className="fw-bold">{region}</h5>
                        <p>Total: {stats.total}</p>
                        <p>✅ Current: {stats.current}</p>
                        <p>🕰 Past: {stats.past}</p>
                        <Button
                          variant="light"
                          size="sm"
                          href={`/regions/${region
                            .toLowerCase()
                            .replace(/\s+/g, "-")}/executive-records`}
                          className="fw-bold mt-2"
                        >
                          View Regional Details
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>

          {/* Back to top */}
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
