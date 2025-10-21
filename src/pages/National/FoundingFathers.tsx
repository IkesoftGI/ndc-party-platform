// src/pages/FoundingFathers.tsx

import { Link } from "react-router-dom";
import danquahImg from "../../assets/Dr J. B Danquah.jpg";
import busiaImg from "../../assets/Dr-K.-A-Busia.jpg";
import domboImg from "../../assets/S. D Dombo.jpg";
import "../../styles/FoundingFathers.css"; // NEW: Separate CSS file

export default function FoundingFathers() {
  return (
    <div className="founders-page">
      <main className="main-content container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="founders-heading">🏛️ Founding Fathers of the Party</h2>
          <Link to="/" className="btn btn-primary">← Back</Link>
        </div>

        <section className="founders-section mt-4">
          <div className="founders-grid">
            <div className="founder-card">
              <img
                src={danquahImg}
                alt="Dr. J. B. Danquah"
                className="founder-image"
              />
              <h4 className="founder-name">Dr. J. B. Danquah</h4>
              <p className="founder-title">Founding Father</p>
              <p>
                A pioneering intellectual and politician, Dr. Danquah is widely
                revered for championing democratic values and laying the
                philosophical foundation of the party.
              </p>
            </div>

            <div className="founder-card">
              <img
                src={busiaImg}
                alt="Dr. K. A. Busia"
                className="founder-image"
              />
              <h4 className="founder-name">Dr. K. A. Busia</h4>
              <p className="founder-title">Founding Father</p>
              <p>
                A respected scholar and former Prime Minister, Dr. Busia's
                leadership and policies helped shape the party's
                socio-political direction and national development.
              </p>
            </div>

            <div className="founder-card">
              <img
                src={domboImg}
                alt="S. D. Dombo"
                className="founder-image"
              />
              <h4 className="founder-name">S. D. Dombo</h4>
              <p className="founder-title">Founding Father</p>
              <p>
                S. D. Dombo was instrumental in mobilizing support in the
                northern regions and strongly advocated for inclusive
                development across Ghana.
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
