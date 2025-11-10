// src/pages/Generic/ConstituencyMPPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Button, Row, Col } from "react-bootstrap";
import PageWithFlagBackground from "@components/Layout/PageWithFlagBackground";
import ConstituencyNavbar from "@components/Navbars/ConstituencyNavbar";
import type { User, Role } from "../../types/User";
import { API_BASE_URL } from "@api/config";
import { resolvePhotoUrl } from "../../utils/photo";

// ✅ Extend User type
interface LocalUser extends User {
  role: Role & {
    isActive?: boolean;
    termStart?: string;
    termEnd?: string;
  };
}

// ✅ Normalize helper
const norm = (s?: string) =>
  (s || "").toLowerCase().trim().replace(/[\s_]+/g, "-");

// ✅ Identify MP roles
const isMPUnit = (unit?: string) => norm(unit) === "member-of-parliament";

// ✅ Extract term dates
const pickTermStart = (u: User) => u.role?.termStartDate ?? u.role?.termStart ?? "";
const pickTermEnd = (u: User) => u.role?.termEndDate ?? u.role?.termEnd ?? "";

// ✅ Compute if active
const computeIsActive = (u: User) => {
  const explicitTrue =
    u.role?.isActive === true ||
    String(u.role?.isActive ?? "").toLowerCase() === "true";
  const ended =
    !!pickTermEnd(u) && new Date(pickTermEnd(u)).getTime() < Date.now();
  return explicitTrue && !ended;
};

export default function ConstituencyMPPage() {
  const { region, constituency } = useParams<{ region: string; constituency: string }>();
  const [current, setCurrent] = useState<LocalUser[]>([]);
  const [past, setPast] = useState<LocalUser[]>([]);
  const navigate = useNavigate();

  // ✅ Fetch MPs with cache-first optimization
  useEffect(() => {
    async function fetchMPs() {
      const CACHE_KEY = `mps-${region}-${constituency}`;
      const cached = localStorage.getItem(CACHE_KEY);

      if (cached) {
        console.log(`💾 Showing cached MPs for ${constituency}`);
        const parsed = JSON.parse(cached);
        setCurrent(parsed.current || []);
        setPast(parsed.past || []);
      }

      try {
        console.log(`🌐 Fetching fresh MPs for ${constituency}...`);
        const res = await axios.get(`${API_BASE_URL}/api/users`);
        const raw: User[] = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        const r = norm(region);
        const c = norm(constituency);

        const matches: LocalUser[] = raw
          .filter((u) => isMPUnit(u.role?.unit))
          .filter((u) => norm(u.region) === r && norm(u.constituency) === c)
          .map((u) => {
            const role = u.role as Role;
            return {
              ...u,
              role: {
                ...role,
                termStart: pickTermStart(u),
                termEnd: pickTermEnd(u),
                isActive: computeIsActive(u),
              },
            };
          });

        const currentList = matches.filter((m) => m.role?.isActive);
        const pastList = matches.filter((m) => !m.role?.isActive);

        setCurrent(currentList);
        setPast(pastList);

        // ✅ Cache results for faster reloads
        localStorage.setItem(CACHE_KEY, JSON.stringify({ current: currentList, past: pastList }));
        console.log(`✅ Updated MP cache for ${constituency}`);
      } catch (err) {
        console.error("❌ Failed to fetch MPs:", err);
        setCurrent([]);
        setPast([]);
      }
    }

    fetchMPs();
  }, [region, constituency]);

  const titleC = constituency || "";
  const totalCount = current.length + past.length;

  return (
    <>
      <ConstituencyNavbar region={region || ""} constituency={titleC} />
      <PageWithFlagBackground title={`🏛️ Member of Parliament - ${titleC}`}>
        <Container className="py-5">
          {/* 🔙 Back Button */}
          <div className="mb-4 text-start">
            <Button
              variant="secondary"
              onClick={() =>
                navigate(`/regions/${region}/constituencies/${constituency}`)
              }
            >
              ← Back to Constituency
            </Button>
          </div>

          {/* 🔢 Counter Section */}
          <div
            className="mb-4 py-2 text-center fw-bold rounded"
            style={{
              background: "linear-gradient(90deg, #006b3f, #d71a28)",
              color: "white",
            }}
          >
            🌍 Total: {totalCount} | ✅ Current: {current.length} | 🕰 Past: {past.length}
          </div>

          {/* 🌟 Current MP */}
          {current.length > 0 && (
            <>
              <h2
                className="fw-bold text-light p-2 rounded mb-4"
                style={{ backgroundColor: "#198754" }}
              >
                🌟 Current MP
              </h2>
              <Row className="justify-content-center">
                {current.map((mp) => (
                  <Col xs={12} sm={6} md={4} key={mp._id}>
                    <div className="executive-card h-100">
                      <img
                        src={resolvePhotoUrl(mp.photo, API_BASE_URL)}
                        alt={mp.name || "MP"}
                        className="executive-image"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/No Image Available.png";
                        }}
                      />
                      <div className="executive-name">{mp.name || "Unnamed"}</div>
                      <div className="executive-position">
                        {mp.role?.position || "Member of Parliament"}
                      </div>
                      {(mp.role?.termStart || mp.role?.termEnd) && (
                        <div className="executive-term">
                          {mp.role?.termStart || "?"} –{" "}
                          {mp.role?.termEnd || "Present"}
                        </div>
                      )}
                      <div className="executive-status text-success fw-bold">
                        Current
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </>
          )}

          {/* 🕰 Past MPs */}
          {past.length > 0 && (
            <>
              <h2
                className="fw-bold text-light p-2 rounded mb-4"
                style={{ backgroundColor: "#6c757d" }}
              >
                🕰 Past MPs
              </h2>
              <Row className="justify-content-center">
                {past.map((mp) => (
                  <Col xs={12} sm={6} md={4} key={mp._id}>
                    <div
                      className="executive-card h-100"
                      style={{ backgroundColor: "#f1f1f1" }}
                    >
                      <img
                        src={resolvePhotoUrl(mp.photo, API_BASE_URL)}
                        alt={mp.name || "MP"}
                        className="executive-image"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/No Image Available.png";
                        }}
                      />
                      <div className="executive-name">{mp.name || "Unnamed"}</div>
                      <div className="executive-position">
                        {mp.role?.position || "Member of Parliament"}
                      </div>
                      {(mp.role?.termStart || mp.role?.termEnd) && (
                        <div className="executive-term">
                          {mp.role?.termStart || "?"} – {mp.role?.termEnd || "?"}
                        </div>
                      )}
                      <div className="executive-status text-muted fw-bold">Past</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </>
          )}

          {/* 🪶 No Data Message */}
          {current.length === 0 && past.length === 0 && (
            <p className="text-center text-light">
              No Member of Parliament data found for this constituency.
            </p>
          )}
        </Container>
      </PageWithFlagBackground>
    </>
  );
}
