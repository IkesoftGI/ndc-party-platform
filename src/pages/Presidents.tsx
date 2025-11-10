// src/pages/Presidents.tsx
import umbrellaIcon from "../assets/NDC.png";
import president1Img from "../assets/JDM.webp";
import president2Img from "../assets/JEA.jpg";
import president3Img from "../assets/JJ.webp";
import "./Presidents.css";

export default function Presidents() {
  return (
    <div className="presidents-page">
      {/* Main */}
      <main className="main-content container text-center py-5">
        <h2 className="presidents-heading">🇬🇭 Presidents of the NDC</h2>

        {/* Current President */}
        <section className="current-president mt-4">
          <h3 className="mb-4">🏛️ Current President</h3>

          <div className="presidents-grid">
            <div className="president-card">
              <img
                src={president1Img}
                alt="H.E. John Dramani Mahama"
                className="president-image"
              />
              <h4 className="president-name">H.E. John Dramani Mahama</h4>
              <p className="president-label">
                President of the Republic of Ghana (2025–Present)
              </p>
              <p>
                H.E. John Dramani Mahama has served Ghana across three distinct
                presidential tenures — completing the term of the late H.E. John Evans Atta Mills in 2012,
                winning his own mandate from 2013 to 2017, and returning to lead
                the nation again in 2025. Renowned for his focus on infrastructure,
                education, and innovation, he continues to champion unity and inclusive
                national development.
              </p>
            </div>
          </div>
        </section>

        {/* Past Presidents */}
        <section className="past-presidents mt-5">
          <h3 className="mb-4">🕰️ Former Presidents</h3>

          <div className="presidents-grid">
            <div className="president-card">
              <img
                src={president2Img}
                alt="H.E. Prof. John Evans Atta Mills"
                className="president-image"
              />
              <h4 className="president-name">H.E. Prof. John Evans Atta Mills</h4>
              <p className="president-label">President of Ghana (2009–2012)</p>
              <p>
                Fondly remembered as the “Asomdwehene” — the King of Peace,
                H.E. Prof. John Evans Atta Mills led Ghana with humility,
                honesty, and calm strength. His tenure from 2009 to 2012
                emphasized unity, social justice, and respect for the rule of law,
                leaving a legacy of peace and moral leadership that still inspires the NDC.
              </p>
            </div>
          </div>
        </section>

        {/* Past Presidents */}
        <section className="past-presidents mt-5">
          <h3 className="mb-4">🕰️ Former Presidents</h3>

          <div className="presidents-grid">
            <div className="president-card">
              <img
                src={president3Img}
                alt="H.E. Jerry John Rawlings"
                className="president-image"
              />
              <h4 className="president-name">H.E. Jerry John Rawlings</h4>
              <p className="president-label">President of Ghana (1993–2001)</p>
              <p>
                H.E. Jerry John Rawlings, founder of the National Democratic Congress,
                served as the first President under the Fourth Republic.
                His vision for accountability, justice, and empowerment
                built the foundation for Ghana’s modern democracy and the enduring spirit of the NDC.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Umbrella Symbol */}
      <section className="text-center my-5">
        <img
          src={umbrellaIcon}
          alt="NDC Umbrella Symbol"
          className="img-fluid mx-auto d-block"
          style={{
            maxHeight: "400px",
            width: "auto",
            objectFit: "contain",
          }}
        />
        <p className="text-muted mt-3">
          The umbrella symbolizes unity, protection, and hope for all Ghanaians
          under the NDC.
        </p>
      </section>

      {/* Footer */}
      <footer className="footer bg-light text-center py-3">
        <small>© 2025 National Democratic Congress Platform</small>
      </footer>
    </div>
  );
}
