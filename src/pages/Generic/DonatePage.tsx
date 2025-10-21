// src/pages/Generic/DonatePage.tsx

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import PageWithFlagBackground from "@components/Layout/PageWithFlagBackground";
import ConstituencyNavbar from "@components/Navbars/ConstituencyNavbar";
import RegionalNavbar from "@components/Navbars/RegionalNavbar";
import "@pages/Presidents.css"; // ✅ crisp image & card style

// ✅ Normalize helper
const norm = (s?: string) => (s || "").toLowerCase().replace(/-/g, " ").trim();

// ✅ Tier detection with colors
const determineTier = (value: number): { tier: string; color: string } => {
  if (value >= 100000) return { tier: "Platinum", color: "primary" };
  if (value >= 70000) return { tier: "Gold", color: "warning text-dark" };
  if (value >= 50000) return { tier: "Silver", color: "secondary" };
  if (value >= 30000) return { tier: "Bronze", color: "danger" };
  return { tier: "Others", color: "light text-dark" };
};

export default function DonatePage() {
  const { region, constituency } = useParams<{ region?: string; constituency?: string }>();

  // ✅ Scope detection
  const scope = constituency
    ? { level: "constituency", region: norm(region), constituency: norm(constituency) }
    : region
    ? { level: "region", region: norm(region) }
    : { level: "national" };

  const title =
    scope.level === "constituency"
      ? `💳 Donate to ${scope.constituency}, ${scope.region}`
      : scope.level === "region"
      ? `💳 Donate to ${scope.region} Region`
      : "💳 Donate to the National Party";

  // ✅ Generate unique localStorage key
  const getStorageKey = () => {
    if (scope.level === "national") return "donations-national";
    if (scope.level === "region") return `donations-region-${scope.region}`;
    if (scope.level === "constituency") return `donations-constituency-${scope.region}-${scope.constituency}`;
    return "donations";
  };

  const STORAGE_KEY = getStorageKey();

  // ✅ Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ghanaCard, setGhanaCard] = useState("");
  const [partyCard, setPartyCard] = useState("");
  const [amount, setAmount] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [tier, setTier] = useState<{ tier: string; color: string }>({ tier: "Others", color: "light text-dark" });
  const [total, setTotal] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);

  // ✅ Update tier when amount changes
  useEffect(() => {
    const value = parseFloat(amount);
    if (!isNaN(value)) {
      setTier(determineTier(value));
    }
  }, [amount]);

  // ✅ Load total donations
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const donations = JSON.parse(stored);
      const sum = donations.reduce((acc: number, entry: any) => acc + Number(entry.totalAmount ?? entry.amount ?? 0), 0);
      setTotal(sum);
    }
  }, [submitted, STORAGE_KEY]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ⚠️ Gentle reminder with option to cancel
    if (!ghanaCard && !partyCard) {
      const proceed = window.confirm(
        "⚠️ Providing Ghana Card or Party Card helps us identify you for future donations so your cumulative rank is updated correctly.\n\nPress OK to proceed without them, or Cancel to go back and fill."
      );
      if (!proceed) return; // stop submission, donor can fill fields
    }


    let donations = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    // Identify donor uniquely
    const donorId = ghanaCard || partyCard || email || name;

    // Find existing donor
    const existingIndex = donations.findIndex((d: any) => d.donorId === donorId);

    if (existingIndex !== -1) {
      // Update existing donor
      donations[existingIndex].totalAmount =
        Number(donations[existingIndex].totalAmount ?? donations[existingIndex].amount ?? 0) + Number(amount);
      donations[existingIndex].tier = determineTier(donations[existingIndex].totalAmount).tier;
      donations[existingIndex].date = new Date().toISOString(); // last updated
    } else {
      // New donor entry
      donations.push({
        donorId,
        name,
        email,
        ghanaCard,
        partyCard,
        totalAmount: Number(amount),
        tier: determineTier(Number(amount)).tier,
        isPublic,
        date: new Date().toISOString(),
      });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(donations));

    setSubmitted(true);
    setName("");
    setEmail("");
    setGhanaCard("");
    setPartyCard("");
    setAmount("");
    setIsPublic(false);
  };

  const publicDonors = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    .filter((d: any) => d.isPublic)
    .sort(
      (a: any, b: any) =>
        Number(b.totalAmount ?? b.amount ?? 0) -
        Number(a.totalAmount ?? a.amount ?? 0)
    );

  return (
    <>
      {/* ✅ Navbar changes by scope */}
      {scope.level === "region" && <RegionalNavbar region={region || ""} />}
      {scope.level === "constituency" && (
        <ConstituencyNavbar region={region || ""} constituency={constituency || ""} />
      )}

      <PageWithFlagBackground title={title}>
        <div style={{ backgroundColor: "#486f94ff", minHeight: "100vh" }}>
          <Container className="py-5 text-center">
            <p className="text-light mb-4">
              Your contribution helps us fund projects, outreach, and operations. Thank you for supporting the cause.
            </p>

            {/* 📊 LIVE DONATION TOTAL */}
            <div className="p-3 bg-light rounded mb-4 shadow-sm">
              <h5 className="fw-bold text-dark">
                📊 Total Donations Received:{" "}
                <span className="text-primary">GHS {total.toLocaleString()}</span>
              </h5>
            </div>

            {/* ✅ Official Channels Placeholder */}
            <div className="p-3 bg-light rounded shadow-sm mb-4 text-start">
              <h5 className="fw-bold text-dark">💳 Official Donation Channels</h5>
              <p className="mb-1 text-dark">Bank Account (Coming Soon)</p>
              <p className="mb-1 text-dark">MTN MoMo: <strong>0000000000</strong> (Placeholder)</p>
              <p className="mb-1 text-dark">Vodafone Cash: <strong>0000000000</strong> (Placeholder)</p>
              <p className="mb-1 text-dark">AirtelTigo Money: <strong>0000000000</strong> (Placeholder)</p>
            </div>

            {/* Donation Form */}
            <div
              className="p-4 rounded shadow-sm text-start"
              style={{ backgroundColor: "white", maxWidth: "600px", margin: "0 auto" }}
            >
              <h5 className="fw-bold mb-3 text-center text-dark">Donation Form</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold text-dark">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold text-dark">Email (optional)</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold text-dark">Ghana Card (optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={ghanaCard}
                    onChange={(e) => setGhanaCard(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold text-dark">Party Card (optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={partyCard}
                    onChange={(e) => setPartyCard(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold text-dark">Donation Amount (GHS)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                {/* ✅ Tier Preview */}
                {amount && (
                  <div className="mb-3">
                    <span className={`badge bg-${tier.color} p-2`}>
                      🎖️ Tier: {tier.tier}
                    </span>
                  </div>
                )}

                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                  />
                  <label className="form-check-label fw-bold text-dark ms-2" htmlFor="isPublic">
                    🌍 Make my donation public
                  </label>
                </div>

                <button type="submit" className="btn btn-success w-100">
                  Donate Now
                </button>
              </form>
            </div>

            {/* 🌍 Public Donor Board */}
            {publicDonors.length > 0 && (
              <div className="mt-5">
                <h4 className="mb-3 text-center text-dark">🌍 Public Donors Board</h4>
                <table className="table table-bordered table-hover table-striped">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Total Amount (GHS)</th>
                      <th>Tier</th>
                      <th>Last Donation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publicDonors.map((entry: any, idx: number) => (
                      <tr key={idx}>
                        <td>{entry.name}</td>
                        <td>{Number(entry.totalAmount ?? entry.amount ?? 0).toLocaleString()}</td>
                        <td>
                          <span
                            className={`badge ${
                              entry.tier === "Platinum"
                                ? "bg-primary"
                                : entry.tier === "Gold"
                                ? "bg-warning text-dark"
                                : entry.tier === "Silver"
                                ? "bg-secondary"
                                : entry.tier === "Bronze"
                                ? "bg-danger"
                                : "bg-light text-dark"
                            }`}
                          >
                            {entry.tier}
                          </span>
                        </td>
                        <td>{new Date(entry.date).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Container>
        </div>
      </PageWithFlagBackground>
    </>
  );
}
