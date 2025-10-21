// src/pages/Regions/GreaterAccra/GreaterAccraRegion.tsx
import React, { useEffect, useState, Suspense } from "react";
import { Link } from "react-router-dom";
import elephantIcon from "@assets/elephant-icon.webp";
import nppFlag from "@assets/ChatGPT-NPP.webp";
import "@styles/Home.css";

// Components
import FloatingBanner from "@components/FloatingBanner";
import RegionalNavbar from "@components/Navbars/RegionalNavbar";
import ExploreRegionsNavbar from "@components/Navbars/ExploreRegionsNavbar";
import BlogCarousel from "@components/BlogCarousel"; // ✅ shared carousel

// Data
import { blogPosts as staticPosts } from "@data/blogPosts";
import type { BlogPost } from "../../types/Blog";

const GreaterAccraRegionHome: React.FC = () => {
  const [nationalPosts, setNationalPosts] = useState<BlogPost[]>([]);
  const [regionalPosts, setRegionalPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    let posts: BlogPost[] = [...staticPosts];

    try {
      const stored = localStorage.getItem("blogPosts");
      if (stored) {
        const parsed = JSON.parse(stored) as BlogPost[];
        parsed.forEach((p) => {
          if (!posts.find((sp) => sp.id === p.id)) {
            posts.push(p);
          }
        });
      }
    } catch (error) {
      console.error("Failed to parse blogPosts from localStorage", error);
    }

    // ✅ National posts
    setNationalPosts(posts.filter((p) => p.scope === "national"));

    // ✅ Greater Accra region posts
    setRegionalPosts(
      posts.filter(
        (p) =>
          p.scope === "regional" &&
          p.region?.toLowerCase().replace(/[-_]/g, " ").trim() === "greater accra"
      )
    );
  }, []);

  return (
    <div
      className="home-page text-white"
      style={{
        backgroundImage: `url(${nppFlag})`,
        backgroundSize: "contain",
        backgroundPosition: "center top",
        backgroundColor: "#dbe6a3ff",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <ExploreRegionsNavbar />
      <RegionalNavbar region="Greater Accra" />

      {/* 📍 Visit Constituencies CTA */}
      <div className="bg-warning-subtle py-3 border-bottom text-center">
        <Link
          to="/regions/greater-accra/constituencies"
          className="btn btn-warning fw-semibold px-4"
        >
          📍 Visit Constituencies
        </Link>
      </div>

      {/* Header */}
      <header className="text-center py-5 bg-dark bg-opacity-50">
        <h1 className="fw-bold">
          🐘 Welcome to the Greater Accra Regional NPP Platform
        </h1>
        <p className="lead">
          Advancing the values and mission of the NPP in the Greater Accra Region.
        </p>
      </header>

      {/* 📝 National Blog Carousel */}
      <Suspense fallback={<div>Loading National Blogs...</div>}>
        <BlogCarousel posts={nationalPosts} title="📝 National Blog Highlights" basePath="/blog" />
      </Suspense>

      {/* 📍 Regional Blog Carousel */}
      <Suspense fallback={<div>Loading Regional Blogs...</div>}>
        <BlogCarousel
          posts={regionalPosts}
          title="📍 Greater Accra Regional Blog"
          basePath="/regions/greater-accra/blog"
        />
      </Suspense>

      <FloatingBanner />

      {/* CTA Buttons */}
      <section className="text-center pb-4">
        <Link to="/regions/greater-accra/donate" className="btn btn-success fw-bold mx-2">
          💰 Support the Region
        </Link>
      </section>

      {/* Elephant */}
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

export default GreaterAccraRegionHome;
