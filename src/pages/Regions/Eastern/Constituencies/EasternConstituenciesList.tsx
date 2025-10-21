// src/pages/Regions/Eastern/Constituencies/EasternConstituenciesList.tsx

import React from "react";
import { Link } from "react-router-dom";
import ExploreRegionsNavbar from "@components/Navbars/ExploreRegionsNavbar";
import RegionalNavbar from "@components/Navbars/RegionalNavbar";
import nppFlag from "@assets/ChatGPT-NPP.webp";
import elephantIcon from "@assets/elephant-icon.webp";
import "@styles/Home.css";

const EasternConstituenciesList: React.FC = () => {
  const constituencies = [
    "Asuogyaman",
    "Lower Manya Krobo",
    "Upper Manya Krobo",
    "Yilo Krobo",
    "New Juaben South",
    "New Juaben North",
    "Akropong",
    "Okere",
    "Akuapem South",
    "Nsawam Adoagyiri",
    "Suhum",
    "Ayensuano",
    "Lower West Akim",
    "Upper West Akim",
    "Akim Oda",
    "Asene Akroso Manso",
    "Akim Swedru",
    "Akyease",
    "Ofoase Ayirebi",
    "Kade",
    "Akwatia",
    "Abirem",
    "Abuakwa South",
    "Abuakwa North",
    "Atiwa West",
    "Atiwa East",
    "Fanteakwa North",
    "Fanteakwa South",
    "Nkawkaw",
    "Mpraeso",
    "Kwahu East",
    "Kwahu Afram Plains North",
    "Afram Plains South",
  ];

  return (
    <div
      className="home-page text-white"
      style={{
        backgroundImage: `url(${nppFlag})`,
        backgroundSize: "contain",
        backgroundPosition: "center top",
        backgroundColor: "#2c3e50",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <ExploreRegionsNavbar />
      <RegionalNavbar region="Eastern" />

      {/* Header */}
      <header className="text-center py-5 bg-dark bg-opacity-50">
        <h1 className="fw-bold">🐘 Eastern Region Constituencies</h1>
        <p className="lead">
          Select a constituency below to explore projects, executives, blogs, and more.
        </p>
      </header>

      {/* Constituencies List */}
      <section className="container py-4">
        <div className="row g-3">
          {constituencies.map((constituency) => (
            <div key={constituency} className="col-12 col-md-6 col-lg-4">
              <Link
                to={`/regions/eastern/constituencies/${constituency
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="btn btn-outline-light w-100 fw-bold py-3"
              >
                {constituency}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Elephant Icon at Bottom */}
      <section className="text-center pt-5">
        <img
          src={elephantIcon}
          alt="Elephant"
          className="img-fluid standing-elephant"
        />
      </section>
    </div>
  );
};

export default EasternConstituenciesList;
