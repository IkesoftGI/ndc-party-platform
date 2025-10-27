// src/pages/Regions/Ashanti/Constituencies/AshantiConstituenciesList.tsx

import React from "react";
import { Link } from "react-router-dom";
import ExploreRegionsNavbar from "@components/Navbars/ExploreRegionsNavbar";
import RegionalNavbar from "@components/Navbars/RegionalNavbar";
import ndcFlag from "@assets/NDC.png";
import umbrellaIcon from "@assets/NDC.png";
import "@styles/Home.css";

const AshantiConstituenciesList: React.FC = () => {
  const constituencies = [
    "Adansi Asokwa",
    "Fomena",
    "New Edubiase",
    "Afigya Kwabre North",
    "Afigya Kwabre South",
    "Ahafo Ano North",
    "Ahafo Ano South-East",
    "Ahafo Ano South-West",
    "Asante Akim Central",
    "Asante Akim North",
    "Asante Akim South",
    "Asokwa",
    "Atwima Kwanwoma",
    "Atwima Mponua",
    "Atwima Nwabiagya North",
    "Atwima Nwabiagya South",
    "Bantama",
    "Bekwai",
    "Bosome Freho",
    "Bosomtwe",
    "Ejisu",
    "Ejura-Sekyedumase",
    "Juaben",
    "Kwabre East",
    "Kwadaso",
    "Mampong",
    "Manhyia North",
    "Manhyia South",
    "Nhyiaeso",
    "Nsuta-Kwamang-Beposo",
    "Obuasi East",
    "Obuasi West",
    "Odotobri",
    "Offinso North",
    "Offinso South",
    "Oforikrom",
    "Old Tafo",
    "Suame",
    "Subin",
    "Sekyere Afram Plains",
    "Sekyere Central",
    "Sekyere East",
    "Sekyere Kumawu",
    "Sekyere South",
    "Manso Adubia",
    "Manso Nkwanta",
    "Asawase",
    "Akrofuom",
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
      <RegionalNavbar region="Ashanti" />

      {/* Header */}
      <header className="text-center py-5 bg-dark bg-opacity-50">
        <h1 className="fw-bold">🐘 Ashanti Region Constituencies</h1>
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
                to={`/regions/ashanti/constituencies/${constituency
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

export default AshantiConstituenciesList;
