// src/pages/Regions/WesternNorth/Constituencies/WesternNorthConstituenciesList.tsx

import React from "react";
import { Link } from "react-router-dom";
import ExploreRegionsNavbar from "@components/Navbars/ExploreRegionsNavbar";
import RegionalNavbar from "@components/Navbars/RegionalNavbar";
import ndcFlag from "@assets/NDC.png";
import umbrellaIcon from "@assets/NDC.png";
import "@styles/Home.css";

const WesternNorthConstituenciesList: React.FC = () => {
  const constituencies = [
    "Aowin",
    "Suaman",
    "Bibiani Anhwiaso Bekwai",
    "Sefwi Wiawso",
    "Sefwi Akontombra",
    "Juaboso",
    "Bodi",
    "Bia West",
    "Bia East",
  ];

  return (
    <div
      className="home-page text-white"
      style={{
        backgroundImage: `url(${ndcFlag})`,
        backgroundSize: "contain",
        backgroundPosition: "center top",
        backgroundColor: "#2c3e50",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <ExploreRegionsNavbar />
      <RegionalNavbar region="Western North" />

      {/* Header */}
      <header className="text-center py-5 bg-dark bg-opacity-50">
        <h1 className="fw-bold">🐘 Western North Region Constituencies</h1>
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
                to={`/regions/western-north/constituencies/${constituency
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
          src={umbrellaIcon}
          alt="umbrella"
          className="img-fluid standing-umbrella"
        />
      </section>
    </div>
  );
};

export default WesternNorthConstituenciesList;
