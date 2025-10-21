// src/pages/Generic/ConstituencyMMDCEPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Button, Row, Col } from "react-bootstrap";
import PageWithFlagBackground from "@components/Layout/PageWithFlagBackground";
import ConstituencyNavbar from "@components/Navbars/ConstituencyNavbar";
import type { User } from "../../types/User";
import { API_BASE_URL } from "@api/config";
import { resolvePhotoUrl } from "../../utils/photo"; // ✅ shared resolver

// ✅ Normalize helper
const norm = (s?: string) =>
  (s || "")
    .toLowerCase()
    .replace(/\bregion\b/g, "")
    .trim()
    .replace(/[\s_]+/g, "-");

// ✅ Detect MMDCE units
const UNIT_KEYWORDS = [
  "mmdce",
  "mce",
  "district-chief-executive",
  "municipal-chief-executive",
  "dce",
];
const isMMDCEUnit = (unit?: string) => {
  const u = norm(unit);
  return UNIT_KEYWORDS.some((k) => u.includes(k));
};

// ✅ Term helpers
const pickTermStart = (u: User) => u.role?.termStartDate ?? u.role?.termStart ?? "";
const pickTermEnd = (u: User) => u.role?.termEndDate ?? u.role?.termEnd ?? "";

// ✅ Compute active status
const computeIsActive = (u: User) => {
  const explicitTrue =
    u.role?.isActive === true ||
    String(u.role?.isActive ?? "").toLowerCase() === "true";
  const ended = !!pickTermEnd(u) && new Date(pickTermEnd(u)).getTime() < Date.now();
  return explicitTrue && !ended;
};

// ✅ Normalize role fields
const withSafeRole = (u: User): User => ({
  ...u,
  role: {
    ...(u.role ?? {}),
    scope: u.role?.scope ?? "",
    unit: u.role?.unit ?? "",
    position: u.role?.position ?? "",
    region: u.role?.region ?? u.region,
    constituency: u.role?.constituency ?? u.constituency,
    termStartDate: pickTermStart(u),
    termEndDate: pickTermEnd(u),
    isActive: computeIsActive(u),
  },
});

export default function ConstituencyMMDCEPage() {
  const { region, constituency } = useParams<{ region: string; constituency: string }>();
  const [current, setCurrent] = useState<User | null>(null);
  const [history, setHistory] = useState<User[]>([]);
  const navigate = useNavigate();

  // ✅ Fetch MMDCEs with cache-first optimization
  useEffect(() => {
    const fetchMMDCEs = async () => {
      const CACHE_KEY = `mmdces-${region}-${constituency}`;
      const cached = localStorage.getItem(CACHE_KEY);

      // 💾 Instantly show cached data if available
      if (cached) {
        console.log(`💾 Showing cached MMDCEs for ${constituency}`);
        const parsed = JSON.parse(cached);
        setCurrent(parsed.current || null);
        setHistory(parsed.history || []);
      }

      try {
        console.log(`🌐 Fetching fresh MMDCEs for ${constituency}...`);
        const res = await axios.get(`${API_BASE_URL}/api/users`);
        const raw: User[] = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        const r = norm(region);
        const c = norm(constituency);

        const matches = raw
          .filter((u) => isMMDCEUnit(u.role?.unit))
          .filter((u) => norm(u.region) === r && norm(u.constituency) === c)
          .map(withSafeRole);

        // ✅ Sort: current first, then by most recent term
        matches.sort((a, b) => {
          const aAct = a.role?.isActive ? 1 : 0;
          const bAct = b.role?.isActive ? 1 : 0;
          if (bAct !== aAct) return bAct - aAct;

          const aEnd = pickTermEnd(a) ? new Date(pickTermEnd(a)).getTime() : -Infinity;
          const bEnd = pickTermEnd(b) ? new Date(pickTermEnd(b)).getTime() : -Infinity;
          if (bEnd !== aEnd) return bEnd - aEnd;

          const aStart = pickTermStart(a)
            ? new Date(pickTermStart(a)).getTime()
            : -Infinity;
          const bStart = pickTermStart(b)
            ? new Date(pickTermStart(b)).getTime()
            : -Infinity;
          return bStart - aStart;
        });

        const currentItem = matches[0] || null;
        const pastItems = matches.slice(1);

        setCurrent(currentItem);
        setHistory(pastItems);

        // ✅ Cache results for faster reloads
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ current: currentItem, history: pastItems })
        );
        console.log(`✅ Updated MMDCE cache for ${constituency}`);
      } catch (err) {
        console.error("❌ Failed to fetch MMDCE list:", err);
        setCurrent(null);
        setHistory([]);
      }
    };

    fetchMMDCEs();
  }, [region, constituency]);

  const titleC = constituency || "";

  return (
    <>
      <ConstituencyNavbar region={region || ""} constituency={titleC} />
      <PageWithFlagBackground title={`🏛️ Municipal / District Chief Executive - ${titleC}`}>
        <Container className="py-5">
          <div
            style={{
              backgroundColor: "#8098afff",
              padding: "30px",
              borderRadius: "12px",
            }}
          >
            {/* 🔙 Back button */}
            <div className="mb-4 text-start">
              <Button
                variant="secondary"
                onClick={() => navigate(`/regions/${region}/constituencies/${constituency}`)}
              >
                ← Back to Constituency
              </Button>
            </div>

            {/* 🌟 Current M/DCE */}
            {!current ? (
              <p className="text-center text-light">
                No Municipal / District Chief Executive found yet.
              </p>
            ) : (
              <>
                <h2
                  className="fw-bold text-light p-2 rounded mb-4"
                  style={{ backgroundColor: "#198754" }}
                >
                  🌟 Current M/DCE
                </h2>
                <div className="executive-card mx-auto mb-5">
                  <img
                    src={resolvePhotoUrl(current.photo, API_BASE_URL)}
                    alt={current.name || "MMDCE"}
                    className="executive-image"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/No Image Available.png";
                    }}
                  />
                  <div className="executive-name">{current.name || "Unnamed"}</div>
                  <div className="executive-position">
                    {current.role?.position || current.role?.unit || "MMDCE"}
                  </div>
                  {(pickTermStart(current) || pickTermEnd(current)) && (
                    <div className="executive-term">
                      {pickTermStart(current)
                        ? new Date(pickTermStart(current)).toLocaleDateString()
                        : "?"}{" "}
                      –{" "}
                      {pickTermEnd(current)
                        ? new Date(pickTermEnd(current)).toLocaleDateString()
                        : current.role?.isActive
                        ? "Present"
                        : "?"}
                    </div>
                  )}
                  <div
                    className={`executive-status ${
                      current.role?.isActive ? "text-success fw-bold" : "text-muted fw-bold"
                    }`}
                  >
                    {current.role?.isActive ? "Current" : "Past"}
                  </div>
                </div>
              </>
            )}

            {/* 🕰 Past M/DCEs */}
            {history.length > 0 && (
              <>
                <h2
                  className="fw-bold text-light p-2 rounded mb-4"
                  style={{ backgroundColor: "#6c757d" }}
                >
                  🕰 Past M/DCEs
                </h2>
                <Row className="g-4">
                  {history.map((u) => (
                    <Col xs={12} sm={6} md={4} key={u._id}>
                      <div className="executive-card h-100">
                        <img
                          src={resolvePhotoUrl(u.photo, API_BASE_URL)}
                          alt={u.name || "MMDCE"}
                          className="executive-image"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/No Image Available.png";
                          }}
                        />
                        <div className="executive-name">{u.name || "Unnamed"}</div>
                        <div className="executive-position">
                          {u.role?.position || u.role?.unit || "MMDCE"}
                        </div>
                        {(pickTermStart(u) || pickTermEnd(u)) && (
                          <div className="executive-term">
                            {pickTermStart(u)
                              ? new Date(pickTermStart(u)).toLocaleDateString()
                              : "?"}{" "}
                            –{" "}
                            {pickTermEnd(u)
                              ? new Date(pickTermEnd(u)).toLocaleDateString()
                              : "?"}
                          </div>
                        )}
                        <div className="executive-status text-muted fw-bold">Past</div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </>
            )}
          </div>
        </Container>
      </PageWithFlagBackground>
    </>
  );
}
