// src/pages/NationalHQPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import  umbrellaIcon from "../assets/NDC.png";
import ndcFlag from "../assets/NDC.png";
import { blogPosts } from "@data/blogPosts";
import "../styles/Home.css";
import FloatingBanner from "../components/FloatingBanner";
import BlogCarousel from "@components/BlogCarousel"; // shared carousel

const NationalHQPage: React.FC = () => {
  // Filter posts that are national
  const recentPosts = blogPosts.filter((post) => post.scope === "national");

  return (
    <div
      className="nhqt-page text-white"
      style={{
        backgroundImage: `url(${ndcFlag})`,
        backgroundSize: "contain",
        backgroundPosition: "center top",
        backgroundColor: "#486f94ff",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <header className="text-center py-5 bg-dark bg-opacity-50">
        <h1 className="fw-bold">🐘 National Headquarters</h1>
        <p className="lead">
          Uniting the past, present, and future of the New Patriotic Party.
        </p>
      </header>

      {/* Vision / Mission / Motto */}
      <section className="text-center container pb-4 bg-dark bg-opacity-50 rounded">
        <h3 className="fw-bold">🎯 Our Vision</h3>
        <p>
          To build a free, democratic, and prosperous Ghana through commitment
          to good governance, economic empowerment, and national unity.
        </p>

        <h3 className="fw-bold mt-4">📜 Our Mission</h3>
        <p>
          To serve Ghana through visionary leadership, grassroots empowerment,
          and enduring democratic principles.
        </p>

        <h3 className="fw-bold mt-4">💬 Our Motto</h3>
        <p>Development in Freedom</p>
      </section>

      {/* Floating Call to Action */}
      <FloatingBanner />

      {/* CTA Buttons */}
      <section className="text-center pb-4">
        <Link to="/projects" className="btn btn-light fw-bold mx-2">
          🏗️ View National Projects
        </Link>
        <Link to="/donate" className="btn btn-success fw-bold mx-2">
          💰 Support the Party
        </Link>
      </section>

      {/* Featured Blog Posts */}
      <BlogCarousel
        posts={recentPosts}
        title="📝 Featured Blog Posts"
        basePath="/blog"
      />

      {/* Elephant Icon */}
      <section className="text-center pt-5">
        <img
          src={umbrellaIcon}
          alt="Big umbrella "
          className="img-fluid standing-umbrella "
        />
      </section>
    </div>
  );
};

export default NationalHQPage;
