// src/pages/Regions/Eastern/Constituencies/Fanteakwa-North/FanteakwaNorthConstituencyHome.tsx

import React from "react";
import { Link } from "react-router-dom";
import elephantIcon from "@assets/elephant-icon.webp";
import nppFlag from "@assets/ChatGPT-NPP.webp";
import "@styles/Home.css";
import FloatingBanner from "@components/FloatingBanner";
import ExploreRegionsNavbar from "@components/Navbars/ExploreRegionsNavbar";
import ConstituencyNavbar from "@components/Navbars/ConstituencyNavbar";
import NationalBlogCard from "@components/NationalBlogCard";
import RegionalBlogCard from "@components/BlogCards/RegionalBlogCard";
import ConstituencyBlogCard from "@components/BlogCards/ConstituencyBlogCard";

const FanteakwaNorthConstituencyHome: React.FC = () => {
  return (
    <div
      className="home-page text-white"
      style={{
        backgroundImage: `url(${nppFlag})`,
        backgroundSize: "contain",
        backgroundPosition: "center top",
        backgroundColor: "#565753ff",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <ExploreRegionsNavbar />
      <ConstituencyNavbar region="Eastern" constituency="Fanteakwa North" />

      {/* ⬅️ Back Button */}
      <div className="bg-warning-subtle py-3 border-bottom ps-4">
        <Link
          to="/regions/eastern/constituencies"
          className="btn btn-warning fw-semibold px-4"
        >
          ⬅️ Back
        </Link>
      </div>

      {/* Header */}
      <header className="text-center py-5 bg-dark bg-opacity-50">
        <h1 className="fw-bold">
          🐘 Welcome to the Fanteakwa North NPP Constituency Platform
        </h1>
        <p className="lead">
          Advancing the NPP vision and grassroots strength in Fanteakwa North.
        </p>
      </header>

      {/* Vision / Mission / Motto */}
      <section className="text-center container pb-4 bg-dark bg-opacity-50 rounded">
        <h3 className="fw-bold">🎯 Our Vision</h3>
        <p>
          To ensure development in Fanteakwa North through proactive leadership,
          party unity, and strategic community engagement.
        </p>

        <h3 className="fw-bold mt-4">📜 Our Mission</h3>
        <p>
          To empower every electoral area, polling station, and member of the
          constituency through active participation and accountability.
        </p>

        <h3 className="fw-bold mt-4">💬 Our Motto</h3>
        <p>Development in Freedom</p>
      </section>

      {/* ✅ National Blog Card */}
      <section className="container my-4">
        <NationalBlogCard />
      </section>

      {/* ✅ Regional Blog Card (Eastern only) */}
      <section className="container my-4">
        <RegionalBlogCard region="Eastern" />
      </section>

      {/* ✅ Constituency Blog Card (Fanteakwa North only) */}
      <section className="container my-4">
        <ConstituencyBlogCard region="Eastern" constituency="Fanteakwa North" />
      </section>

      <FloatingBanner />

      {/* ✅ Support Fanteakwa North CTA */}
      <section className="text-center pb-4">
        <Link
          to="/regions/eastern/constituencies/fanteakwa-north/donate"
          className="btn btn-success fw-bold mx-2"
        >
          💰 Support Fanteakwa North
        </Link>
      </section>

      {/* 🐘 Elephant Icon at Bottom */}
      <section className="text-center pt-5">
        <img
          src={elephantIcon}
          alt="Big Elephant"
          className="img-fluid standing-elephant"
        />
      </section>
    </div>
  );
};

export default FanteakwaNorthConstituencyHome;
