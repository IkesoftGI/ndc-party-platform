import elephantIcon from "../assets/elephant-icon.webp";
import akufoAddoImg from "../assets/President-Akuffo-Addo.jpg";
import kufuorImg from "../assets/President Kuffuor.jpg";
import "./Presidents.css";

export default function Presidents() {
  return (
    <div className="presidents-page">      
      {/* Main */}
      <main className="main-content container text-center py-5">
        <h2 className="presidents-heading">🇬🇭 Presidents of the Party</h2>

        <section className="past-presidents mt-4">
          <h3 className="mb-4">🕰️ Former Presidents</h3>

          <div className="presidents-grid">
            <div className="president-card">
              <img src={akufoAddoImg} alt="H.E. Nana Addo Dankwa Akufo-Addo" className="president-image" />
              <h4 className="president-name">H.E. Nana Addo Dankwa Akufo-Addo</h4>
              <p className="president-label">President of Ghana (2017–2024)</p>
              <p>
                Nana Akufo-Addo served as President from 2017 to 2024. He is widely recognized
                for implementing the Free SHS policy, driving industrial transformation, and
                advancing democratic governance in Ghana.
              </p>
            </div>

            <div className="president-card">
              <img src={kufuorImg} alt="H.E. John Agyekum Kufuor" className="president-image" />
              <h4 className="president-name">H.E. John Agyekum Kufuor</h4>
              <p className="president-label">President of Ghana (2001–2009)</p>
              <p>
                John Agyekum Kufuor led Ghana from 2001 to 2009, emphasizing good governance,
                economic stability, and international diplomacy. He remains one of the most
                respected statesmen in NPP history.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Big Elephant Section */}
      <section className="text-center my-5">
        <img
          src={elephantIcon}
          alt="Big Elephant Symbol"
          className="img-fluid mx-auto d-block"
          style={{ maxHeight: "400px", width: "auto", objectFit: "contain" }}
        />
        <p className="text-muted mt-3">
          The elephant stands tall — strong, peaceful, and united.
        </p>
    </section>

      {/* Footer */}
      <footer className="footer bg-light text-center py-3">
        <small> {} </small>
      </footer>
    </div>
  );
}
