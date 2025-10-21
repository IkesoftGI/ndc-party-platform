// src/pages/Regions/Volta/Constituencies/VoltaConstituenciesList.tsx

import React from "react";
import { Link } from "react-router-dom";
import ExploreRegionsNavbar from "@components/Navbars/ExploreRegionsNavbar";
import RegionalNavbar from "@components/Navbars/RegionalNavbar";
import nppFlag from "@assets/ChatGPT-NPP.webp";
import elephantIcon from "@assets/elephant-icon.webp";
import "@styles/Home.css";

const VoltaConstituenciesList: React.FC = () => {
  const constituencies = [
    "Keta",
    "Anlo",
    "Ketu South",
    "Ketu North",
    "Akatsi South",
    "Akatsi North",
    "South Tongu",
    "Central Tongu",
    "North Tongu",
    "Adaklu",
    "Agotime Ziope",
    "Ho Central",
    "Ho West",
    "South Dayi",
    "Kpando",
    "North Dayi",
    "Hohoe",
    "Afadjato South",
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
      <RegionalNavbar region="Volta" />

      {/* Header */}
      <header className="text-center py-5 bg-dark bg-opacity-50">
        <h1 className="fw-bold">🐘 Volta Region Constituencies</h1>
        <p className="lead">
          Select a constituency below to explore projects, executives, blogs, and more.
        </p>
      </header>

      {/* Constituencies Grid */}
      <section className="container py-4">
        <div className="row g-3">
          {constituencies.map((constituency) => (
            <div key={constituency} className="col-12 col-md-6 col-lg-4">
              <Link
                to={`/regions/volta/constituencies/${constituency
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

export default VoltaConstituenciesList;
