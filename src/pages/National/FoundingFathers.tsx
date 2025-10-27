// src/pages/National/FoundingFathers.tsx

import { Link } from "react-router-dom";
import ndcLogo from "../../assets/NDC.png";
import "../../styles/FoundingFathers.css";

export default function FoundingFathers() {
  return (
    <div className="founders-page">
      <main className="main-content container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="founders-heading">🏛️ Founding Fathers of the NDC</h2>
          <Link to="/" className="btn btn-primary">← Back</Link>
        </div>

        <section className="founders-section mt-4">
          <div className="founders-grid">
            <div className="founder-card">
              <img
                src={ndcLogo}
                alt="Jerry John Rawlings"
                className="founder-image"
              />
              <h4 className="founder-name">Flt. Lt. Jerry John Rawlings</h4>
              <p className="founder-title">Founder & Visionary Leader</p>
              <p>
                Founder of the National Democratic Congress (NDC), known for his
                leadership, revolutionary spirit, and dedication to social justice
                and national unity.
              </p>
            </div>

            <div className="founder-card">
              <img
                src={ndcLogo}
                alt="Dr. Obed Asamoah"
                className="founder-image"
              />
              <h4 className="founder-name">Dr. Obed Asamoah</h4>
              <p className="founder-title">Founding Member</p>
              <p>
                A key architect of the party’s constitution and long-serving legal
                advisor who played a central role in shaping NDC’s democratic
                foundation.
              </p>
            </div>

            <div className="founder-card">
              <img
                src={ndcLogo}
                alt="Alhaji Iddrisu Mahama"
                className="founder-image"
              />
              <h4 className="founder-name">Alhaji Iddrisu Mahama</h4>
              <p className="founder-title">Founding Member</p>
              <p>
                A respected statesman whose contribution to the formation of the
                NDC emphasized inclusiveness and grassroots political engagement
                across Ghana.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer text-center py-3 mt-5">
        <small>© 2025 IKESOFT. All rights reserved.</small>
      </footer>
    </div>
  );
}
