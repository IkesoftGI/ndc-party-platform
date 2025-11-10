// src/pages/National/FoundingFathers.tsx

import { Link } from "react-router-dom";
import jjMilitary from "../../assets/JJ_Military.jpg";
import jjCivil from "../../assets/JJ2.webp";
import "../../styles/FoundingFathers.css";

export default function FoundingFathers() {
  return (
    <div className="founders-page">
      <main className="main-content container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="founders-heading text-uppercase">🏛️ Sole Founding Father of the NDC</h2>
        </div>

        {/* Section 1: Military Era */}
        <section className="founder-section text-center mb-5">
          <div className="founder-frame shadow-lg">
            <img
              src={jjMilitary}
              alt="Flt. Lt. Jerry John Rawlings (Military Era)"
              className="founder-image"
            />
            <div className="founder-caption">
              <h3 className="founder-name text-danger mt-3">
                Flt. Lt. Jerry John Rawlings (Military Era)
              </h3>
              <p className="fs-5 text-start px-md-5">
                Flt. Lt. Jerry John Rawlings (1947-2020) emerged as a bold voice for justice and
                accountability during one of Ghana's most turbulent eras. In 1979, as a young
                Air Force officer, he led the June 4th uprising, calling for integrity and the
                cleansing of corruption from national life. After a brief transition to civilian
                rule, Rawlings returned in 1981 through the 31st December Revolution, establishing
                the Provisional National Defence Council (PNDC) to restore discipline, equity, and
                social justice. His leadership during this period reshaped the moral and political
                consciousness of the nation, laying the foundation for the democratic transition
                that was to follow.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Democratic Era */}
        <section className="founder-section text-center mb-5">
          <div className="founder-frame shadow-lg">
            <img
              src={jjCivil}
              alt="H.E. Jerry John Rawlings (Democratic Era)"
              className="founder-image"
            />
            <div className="founder-caption">
              <h3 className="founder-name text-success mt-3">
                H.E. Jerry John Rawlings (Democratic Era)
              </h3>
              <p className="fs-5 text-start px-md-5">
                In 1992, Rawlings transformed Ghana's political landscape once more — founding the
                <strong> National Democratic Congress (NDC)</strong> and leading the nation into
                the Fourth Republic. Elected as Ghana's first President under the 1992 Constitution,
                he served two full terms from 1993 to 2001. His democratic leadership emphasized
                nation-building, economic restructuring, and participatory governance.  
                <br /><br />
                Under his stewardship, Ghana achieved significant macroeconomic stability and
                infrastructural progress, while maintaining peace and unity in a maturing democracy.
                After peacefully handing over power in 2001, he continued to serve as an elder
                statesman and moral compass, advocating for integrity, patriotism, and the welfare
                of ordinary Ghanaians. His legacy endures as a symbol of courage, discipline, and
                selfless devotion to national service.
              </p>
            </div>
          </div>
        </section>

        {/* Legacy Quote */}
        <section className="legacy-quote text-center mt-5">
          <blockquote className="blockquote">
            “Democracy is not a spectator sport. It requires participation, sacrifice, and truth.”
          </blockquote>
          <footer className="blockquote-footer text-success fw-bold">
            — Flt. Lt. Jerry John Rawlings
          </footer>
        </section>
      </main>

      <footer className="footer text-center py-3 mt-5">
        <small>© 2025 National Democratic Congress Platform — In Honor of Our Sole Founder</small>
      </footer>
    </div>
  );
}
